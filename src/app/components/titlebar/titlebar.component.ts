import { Component } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { ElementsService } from '../../providers/elements.service';
import { RPCService } from '../../providers/rpc.service';

@Component({
    selector: 'app-titlebar',
    templateUrl: './titlebar.component.html',
    styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent {
    constructor(
        private electron: ElectronService,
        private elements: ElementsService,
        public rpc: RPCService
    ) {}

    /* Navigation Controls */
    public onDrawer(): void {
        this.elements.drawer.toggle().catch();
    }

    /* Application Controls */

    public get isMaximized(): boolean {
        return this.electron.browser.isMaximized();
    }

    public onMinimize(): void {
        this.electron.browser.minimize();
    }

    public onMaximize(): void {
        if (this.electron.browser.isMaximized()) {
            this.electron.browser.unmaximize();
        } else {
            this.electron.browser.maximize();
        }
    }

    public onClose(): void {
        this.rpc.syncStore(false);
        this.electron.browser.close();
    }
}
