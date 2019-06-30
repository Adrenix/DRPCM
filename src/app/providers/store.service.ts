import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Config } from '../typings/config';

import path from 'path';
import fs from 'fs';

@Injectable({
    providedIn: 'root'
})

export class StoreService {
    public path: string;
    public data: Config;
    public clean: Config = {
        clientId: '',
        assets: [],
        details: '',
        state: '',
        largeAsset: '',
        largeHover: '',
        smallAsset: '',
        smallHover: '',
        timer: false,
        partyState: false,
        partyMax: 4,
        partySize: 0,
        doTutorial: true
    };

    constructor(private electron: ElectronService) {
        this.path = path.join(this.electron.remote.app.getPath('userData'), 'config.json');
        this.data = this.parse(this.path, this.clean);
    }


    private parse(file: string, store: Config): Config {
        try {
            const disk: Config = JSON.parse(fs.readFileSync(file) as any);
            const keys: string[] = Object.keys(this.clean);

            keys.forEach(key => {
                if (!disk[key]) {
                    disk[key] = this.clean[key];
                }
            });

            return disk;
        } catch (_) {
            return store;
        }
    }

    public get(key: keyof Config): Config[keyof Config] {
        return this.data[key];
    }

    public set(key: keyof Config, value: Config[keyof Config]): void {
        this.data[key] = value;
    }

    public save(): void {
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
}
