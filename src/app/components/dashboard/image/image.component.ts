import { Component } from '@angular/core';
import { RPCService } from '../../../providers/rpc.service';

@Component({
    selector: 'image-help-component',
    templateUrl: 'image.help.dialog.html'
})
export class ImageHelpComponent {}

@Component({
    selector: 'app-dashboard-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss']
})
export class ImageComponent {
    constructor(public rpc: RPCService) {}

    public onRefreshLists(): void {
        this.rpc.cacheAssets().then(() => {
            this.rpc.syncAssets();
        });
    }
}
