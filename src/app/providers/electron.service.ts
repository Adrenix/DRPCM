import { Injectable } from '@angular/core';
import { WranggleRpc } from '@wranggle/rpc';
import { BrowserWindow, ipcRenderer, webFrame, remote, screen, shell } from 'electron';
import RemoteTransport from '../../../lib/rpc';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({
    providedIn: 'root'
})
export class ElectronService {

    public transport: RemoteTransport;
    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    remote: typeof remote;
    screen: typeof screen;
    shell: typeof shell;
    childProcess: typeof childProcess;
    fs: typeof fs;

    constructor() {
        // Conditional imports
        if (ElectronService.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;
            this.remote = window.require('electron').remote;
            this.screen = window.require('electron').screen;
            this.shell = window.require('electron').shell;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
        }

        this.transport = new WranggleRpc<RemoteTransport>({
            electron: {
                ipcReceiver: window.require('electron').ipcRenderer,
                ipcSender: window.require('electron').ipcRenderer
            }
        }).remoteInterface();
    }

    public get browser(): BrowserWindow {
        return this.remote.getCurrentWindow();
    }

    public static isElectron(): boolean {
        return window && window.process && window.process.type;
    }
}
