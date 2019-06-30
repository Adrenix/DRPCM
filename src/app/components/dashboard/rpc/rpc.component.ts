import { Component } from '@angular/core';
import { RPCService } from '../../../providers/rpc.service';

@Component({
    selector: 'rpc-help-component',
    templateUrl: 'rpc.help.dialog.html'
})
export class RPCHelpComponent {}

@Component({
    selector: 'app-dashboard-rpc',
    templateUrl: './rpc.component.html',
    styleUrls: ['./rpc.component.scss']
})
export class RPCComponent {
    constructor(private rpc: RPCService) {}
}
