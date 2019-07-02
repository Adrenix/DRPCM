import { Component, Inject, Injectable } from '@angular/core';
import { Asset, Data } from './rpc.interface';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ElectronService } from './electron.service';
import { StoreService } from './store.service';

import { Util } from '../api/util';

import axios from 'axios';
import * as RPC from 'discord-rich-presence';

@Component({
    selector: 'connection-error-dialog',
    templateUrl: 'html/connection.error.dialog.html'
})
export class ConnectionErrorComponent {
    constructor(public dialogRef: MatDialogRef<ConnectionErrorComponent>) {}

    public onClose(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'rpc-error-dialog',
    templateUrl: 'html/rpc.error.dialog.html'
})
export class RPCErrorComponent {
    constructor(
        public dialogRef: MatDialogRef<RPCErrorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { error: string }
    ) {}

    public onClose(): void {
        this.dialogRef.close();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RPCService {
    public clientId: string;
    public cache: RPC.ActivityResponse;
    public clientActivated: boolean = false;
    public connecting: boolean = false;
    public isAssetCooling: boolean = false;
    public rpcError: string = '';
    public defaultAvatar: string = `https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png`;
    public assets: Array<Asset>;
    public data: Data;

    private _dataCache: Partial<Data> = {};
    private _isValidCooling: boolean = false;

    constructor(
        private electron: ElectronService,
        private store: StoreService,
        private dialog: MatDialog,
        private snackbar: MatSnackBar
    ) {
        this.empty();
        this.cacheAssets().catch();
        this.setAssets(this.store.data.assets);

        this.electron.ipcRenderer.on('render-transport-closed', () => {
            this.snackbar.open('Discord client was disconnected.', 'Close', { duration: 3000 });
        });

        this.electron.ipcRenderer.on('log', (_: null, log: string, data?: any) => {
            console.log(`[MAIN PROCESS]: ${log}`, data);
        });
    }

    public async isValidIdentifier(id: string): Promise<boolean> {
        let isUpdatedId: boolean = false; await Util.sleep(1000);

        if (id === this.clientId && this._isValidCooling) {
            return true;
        } else if (id === this.clientId) {
            this._isValidCooling = true;
            setTimeout(() => {
                this._isValidCooling = false;
            }, 10000);
        } else { isUpdatedId = true; }

        return axios.get<Asset[]>(`https://discordapp.com/api/oauth2/applications/${id}/assets`).then(async response => {
            console.log(`valid client ${this.clientId}`, response.data); this.clientId = id;
            if (isUpdatedId) {
                await this.cacheAssets();
                this.syncAssets();
            }

            return true;
        }).catch(error => {
            console.error(error); return false;
        });
    }

    public getClient(): Promise<RPC.RichPresence | undefined> {
        return this.electron.transport.getClient().then(res => {
            console.log('received client response', res);
            return res;
        });
    }

    public syncAssets(): void {
        let updateLargeAsset: boolean = true;
        let updateSmallAsset: boolean = true;

        this.assets.forEach(asset => {
            console.log('check asset', asset);
            if (this.data.largeAsset === asset.id) {
                console.log('large asset match');
                updateLargeAsset = false;
            } else if (this.data.smallAsset === asset.id) {
                console.log('small asset match');
                updateSmallAsset = false;
            }
        });

        if (updateLargeAsset) { console.log('clearing large asset'); this.data.largeAsset = ''; }
        if (updateSmallAsset) { console.log('clearing small asset'); this.data.smallAsset = ''; }
    }

    public setAssets(src: Asset[]): void {
        if (!this.assets) { this.assets = src; return; }

        this.assets.length = 0;
        this.assets.push(...src);
    }

    public getAssets(): Promise<Array<Asset>> {
        if (!this.clientId) { return new Promise(resolve => resolve([])); }

        this.isAssetCooling = true;
        setTimeout(() => {
            this.isAssetCooling = false;
        }, 5000);

        return axios.get<Asset[]>(`https://discordapp.com/api/oauth2/applications/${this.clientId}/assets`).then(response => {
            console.log(`return asset data from ${this.clientId}`, response.data);
            return response.data;
        }).catch(error => {
            console.error(error); return [];
        });
    }

    public cacheAssets(): Promise<void> {
        return new Promise(resolve => {
            this.getAssets().then(res => {
                this.setAssets(res); resolve();
            });
        });
    }

    public getAssetImage(assetId: string): string {
        return `https://cdn.discordapp.com/app-assets/${this.clientId}/${assetId}`;
    }

    public getAssetKey(assetId: string): string {
        return assetId ? this.assets.find(asset => asset.id === assetId).name : '';
    }

    public async getUserAvatar(): Promise<string> {
        const client = await this.getClient();

        if (client && client.rpc.user) {
            return `https://cdn.discordapp.com/avatars/${client.rpc.user.id}/${client.rpc.user.avatar}`;
        } else {
            return ``;
        }
    }

    public async getUserData(): Promise<RPC.User | undefined> {
        const client = await this.getClient(); return client ? client.rpc.user : undefined;
    }

    private async _wait(): Promise<void> {
        this.connecting = true; await Util.sleep(1000);
    }

    private _displayConnectionError(): void {
        this.dialog.open(ConnectionErrorComponent);
    }

    private _resolveConnection(state: boolean): void {
        this.connecting = false;
        this.clientActivated = state;
        this.syncStore(false);
    }

    public connect(): Promise<void> {
        if (this.connecting) { return; }

        return new Promise(async resolve => {
            await this._wait();

            this.electron.transport.connect(this.clientId).then(() => {
                this._resolveConnection(true);
                resolve();
            }).catch(() => {
                this._resolveConnection(false);
                this._displayConnectionError();
                resolve();
            });
        });
    }

    public setActivity(): void {
        const args: RPC.ActivityArgs = {
            state: this.data.state || undefined,
            details: this.data.details || undefined,
            startTimestamp: this.data.timer ? Date.now() : undefined,
            endTimestamp: undefined,
            largeImageKey: this.getAssetKey(this.data.largeAsset) || undefined,
            largeImageText: this.data.largeHover || undefined,
            smallImageKey: this.getAssetKey(this.data.smallAsset) || undefined,
            smallImageText: this.data.smallHover || undefined,
            // tslint:disable-next-line:radix
            partySize: this.data.partyState ? parseInt(String(this.data.partySize)) : undefined,
            // tslint:disable-next-line:radix
            partyMax: this.data.partyState ? parseInt(String(this.data.partyMax)) : undefined
        };

        if (!this.validatedPresence()) {
            return;
        }

        this.electron.transport.setActivity(args).then((response) => {
            this.cache = response;
            this.data.name = this.cache.name;
            this.syncStore();
        }).catch(() => {
            this._displayConnectionError();
        });
    }

    public clearActivity(): void {
        this.data.name = 'Stopped';
        this.electron.transport.clearActivity();
    }

    public validatedPresence(): boolean {
        /**
         * All RPC properties are optional.
         *
         * @Conditional - Check party constraints
         * @Conditional - Validate time stamps
         * @Conditional - Check all string lengths
         */

        if (!this.getClient()) {
            this.rpcError = `Your discord client needs to be connected to use RPC.`;
        } else if (!this.data.state) {
            this.rpcError = `You need to have 'state' set.`;
        } else if (this.data.state.length < 2) {
            this.rpcError = `Your 'state' needs to be at least 2 characters.`;
        } else if (!this.data.details) {
            this.rpcError = `You need to have 'details' set.`;
        } else if (this.data.details.length < 2) {
            this.rpcError = `Your 'details' needs to be at least 2 characters.`;
        } else if (Util.getBinarySize(this.data.state) >= 128) {
            this.rpcError = `Your 'state' text is too large!`;
        } else if (Util.getBinarySize(this.data.details) >= 128) {
            this.rpcError = `Your 'details' text is too large!`;
        } else if (Util.getBinarySize(this.data.largeHover) >= 128) {
            this.rpcError = `Your 'large hover' text is too large!`;
        } else if (Util.getBinarySize(this.data.smallHover) >= 128) {
            this.rpcError = `Your 'small hover' text is too large!`;
        } else if (this.data.partySize > this.data.partyMax) {
            this.rpcError = `Your party size cannot be greater than party max!`;
        }

        if (this.rpcError) {
            this.dialog.open(RPCErrorComponent, { data: { error: this.rpcError }}); return false;
        }

        this.rpcError = ``; return true;
    }

    public syncStore(snackbar = true): void {
        this.store.data.clientId = this.clientId;
        this.store.data.details = this.data.details;
        this.store.data.state = this.data.state;
        this.store.data.assets = this.assets;
        this.store.data.largeAsset = this.data.largeAsset;
        this.store.data.largeHover = this.data.largeHover;
        this.store.data.smallAsset = this.data.smallAsset;
        this.store.data.smallHover = this.data.smallHover;
        this.store.data.timer = this.data.timer;
        this.store.data.partyState = this.data.partyState;
        this.store.data.partyMax = this.data.partyMax;
        this.store.data.partySize = this.data.partySize;
        this.store.save();

        if (snackbar) { this.snackbar.open('Saved RPC data.', 'Close', { duration: 3000 }); }
    }

    public empty(): void {
        this.clientId = this.store.data.clientId;
        this.data = {
            avatar: this.defaultAvatar,
            name: 'Stopped',
            details: this.store.data.details,
            state: this.store.data.state,
            largeAsset: this.store.data.largeAsset,
            smallAsset: this.store.data.smallAsset,
            largeHover: this.store.data.largeHover,
            smallHover: this.store.data.smallHover,
            timer: this.store.data.timer,
            partyState: this.store.data.partyState,
            partyMax: this.store.data.partyMax,
            partySize: this.store.data.partySize
        };
    }

    public reset(): void {
        Object.assign(this._dataCache, this.data);

        this.data.name = 'Stopped';
        this.data.details = '';
        this.data.state = '';
        this.data.largeAsset = '';
        this.data.smallAsset = '';
        this.data.largeHover = '';
        this.data.smallHover = '';
        this.data.timer = false;
        this.data.partyState = false;
        this.data.partyMax = 4;
        this.data.partySize = 0;
        this.snackbar.open('Successfully cleared RPC data.', 'Undo', { duration: 5000,  })
            .onAction().subscribe(() => {
                this.undoReset();
            })
        ;
    }

    public undoReset(): void {
        Object.assign(this.data, this._dataCache);
    }

    public clearClientFields(): void {
        const cache = this.clientId;

        this.clientId = '';
        this.snackbar.open('Cleared client identifier.', 'Undo', { duration: 5000 })
            .onAction().subscribe(() => {
                this.clientId = cache;
            })
        ;
    }

    public clearImageFields(): void {
        const cache = {
            largeAsset: this.data.largeAsset,
            largeHover: this.data.largeHover,
            smallAsset: this.data.smallAsset,
            smallHover: this.data.smallHover
        };

        this.data.largeAsset = '';
        this.data.largeHover = '';
        this.data.smallAsset = '';
        this.data.smallHover = '';

        this.snackbar.open('Cleared image fields.', 'Undo', { duration: 5000 })
            .onAction().subscribe(() => {
                this.data.largeAsset = cache.largeAsset;
                this.data.largeHover = cache.largeHover;
                this.data.smallAsset = cache.smallAsset;
                this.data.smallHover = cache.smallHover;
            })
        ;
    }

    public clearTextFields(): void {
        const cache = {
            details: this.data.details,
            state: this.data.state,
            timer: this.data.timer,
            partyState: this.data.partyState,
            partyMax: this.data.partyMax,
            partySize: this.data.partySize
        };

        this.data.details = '';
        this.data.state = '';
        this.data.timer = false;
        this.data.partyState = false;
        this.data.partyMax = 4;
        this.data.partySize = 0;

        this.snackbar.open('Cleared text fields.', 'Undo', { duration: 5000 })
            .onAction().subscribe(() => {
                this.data.details = cache.details;
                this.data.state = cache.state;
                this.data.timer = cache.timer;
                this.data.partyState = cache.partyState;
                this.data.partyMax = cache.partyMax;
                this.data.partySize = cache.partySize;
            })
        ;
    }

    public destroy(): void {
        this.clientActivated = false;
        this.clearActivity();
        this.electron.transport.disconnect();
    }
}
