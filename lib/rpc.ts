import { BrowserWindow } from 'electron';
import makeClient from 'discord-rich-presence';

export default class RemoteTransport {
    public client: makeClient.RichPresence | undefined;

    constructor(public window: BrowserWindow) {}

    private _log(str: string, data?: any): void {
        console.log(str, data);
        this.window.webContents.send('log', str, data);
    }

    private _createClient(id: string): void {
        this.client = makeClient(id);
        this.client.on('error', err => {
            this._log('error', err);
        });

        this.client.rpc.transport.on('close', () => {
            this._log('client transport closed');
            this.window.webContents.send('render-transport-closed');
        });

        this._log('successfully created client', this.client);
    }

    public async getClient(): Promise<makeClient.RichPresence | undefined> {
        this._log('client requested: sending promise', this.client);
        return this.client;
    }

    public connect(id: string): Promise<void> {
        this._log('main-rpc-connect: attempting to connect rpc...', id);
        if (this.client) {
            this._log('destroying old client');
            this.disconnect();
        }

        this._createClient(id);

        return new Promise<void>((resolve, reject) => {
            const callExpire = () => {
                this._log('connection timeout');
                if (this.client) { this.client.removeListener('connected', callConnection); }
                reject('Connection timed out.');
            };

            const callConnection = rpc => {
                this._log('connected', rpc);
                if (this.client) { this.client.removeListener('error', callExpire); }
                resolve(rpc);
            };

            this.client.once('connected', callConnection);
            this.client.once('error', callExpire);
        });
    }

    public setActivity(data: makeClient.ActivityArgs): Promise<makeClient.ActivityResponse> {
        this._log('setting rpc activity with', data);

        return new Promise<makeClient.ActivityResponse>((resolve, reject) => {
            if (!this.client) {
                return reject('No discord client connected.');
            }

            const expire = setTimeout(() => {
                this._log('setActivity timeout');
                reject('Could not set activity.');
            }, 5000);

            this.client.updatePresence(data);
            this.client.once('activity', (response: makeClient.ActivityResponse) => {
                clearTimeout(expire);
                resolve(response);
            });
        });
    }

    public clearActivity(): void {
        if (!this.client) {
            this._log('no client connected to clear'); return;
        }

        this._log('clearing activity');
        this.client.clearPresence();
    }

    public disconnect(): void {
        if (!this.client) {
            this._log('no client exists to disconnected'); return;
        }

        this._log('disconnecting client');
        this.client.disconnect();
    }
}
