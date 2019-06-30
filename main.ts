import { BrowserWindow, app, screen, ipcMain } from 'electron';
import { WranggleRpc } from '@wranggle/rpc';

import * as path from 'path';
import * as url from 'url';
import RemoteTransport from './lib/rpc';

let serve, win: BrowserWindow;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
    // Work Area
    const size = screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({
        x: 100,
        y: 100,
        width: size.width / 2,
        height: size.height / 2,
        minWidth: 1240,
        minHeight: 300,
        frame: false,
        icon: __dirname + '/src/assets/icons/rpc.png',
        backgroundColor: '#303030',
        webPreferences: {
            nodeIntegration: true,
        }
    });

    // Electron Routing Manager
    const rpc = new WranggleRpc({
        electron: {
            ipcReceiver: ipcMain,
            ipcSender: win.webContents
        }
    });

    rpc.addRequestHandlerDelegate(new RemoteTransport(win));

    // Development/Production Serving
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200');
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    win.on('closed', () => {
        win = null;
    });
}

try {
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });
} catch (e) {
    throw e;
}
