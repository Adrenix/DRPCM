import { Component, DoCheck } from '@angular/core';
import { RPCService } from '../../../providers/rpc.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'text-help-component',
    templateUrl: 'text.help.dialog.html'
})
export class TextHelpComponent {}

@Component({
    selector: 'app-dashboard-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss']
})
export class TextComponent implements DoCheck {
    constructor(public rpc: RPCService) {}

    public detailsControl = new FormControl(this.rpc.data.details, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(128)
    ]);

    public stateControl = new FormControl(this.rpc.data.state, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(128)
    ]);

    public partyMaxControl = new FormControl(this.rpc.data.partyMax, [
        Validators.required,
        Validators.min(1),
        Validators.max(100)
    ]);

    public partySizeControl = new FormControl(this.rpc.data.partySize, [
        Validators.required,
        Validators.min(0),
        Validators.max(this.rpc.data.partyMax)
    ]);

    public validatePartySlider(): boolean {
        if (!this.rpc.data.partyState) { return false; }
        if (!this.rpc.data.partyMax) { return false; }
        if (!this.rpc.data.partySize && typeof this.rpc.data.partySize !== 'number') { return false; }
        if (this.rpc.data.partySize < 0) { return false; }
        if (this.rpc.data.partyMax > 100) { return false; }
        return this.rpc.data.partySize <= this.rpc.data.partyMax;
    }

    ngDoCheck(): void {
        if (this.rpc.connecting) {
            this.detailsControl.disable();
            this.stateControl.disable();
        } else {
            this.detailsControl.enable();
            this.stateControl.enable();
        }

        if (!this.rpc.data.partyState || this.rpc.connecting) {
            this.partyMaxControl.disable();
            this.partySizeControl.disable();
        } else if (this.rpc.data.partyState && !this.rpc.connecting) {
            this.partyMaxControl.enable();
            this.partySizeControl.enable();
        }
    }
}
