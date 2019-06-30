import { Component, OnInit } from '@angular/core';
import { RPCService } from '../../../providers/rpc.service';

@Component({
    selector: 'user-help-component',
    templateUrl: 'user.help.dialog.html'
})
export class UserHelpComponent {}

@Component({
    selector: 'app-dashboard-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public avatar: string = '';
    public username: string = '';
    public checking: boolean = false;
    public isValidId: boolean = false;

    constructor(public rpc: RPCService) {}

    ngOnInit() {
        this.validClientId(this.rpc.clientId).catch();
    }

    public async validClientId(id: string): Promise<void> {
        return new Promise(() => {
            this.checking = true;
            this.rpc.isValidIdentifier(id).then(state => {
                this.checking = false; this.isValidId = state;
            }).catch(() => {
                this.checking = false; this.isValidId = false;
            });
        });
    }

    public async setUsername(): Promise<string> {
        const data = await this.rpc.getUserData(); return data ? `${data.username}#${data.discriminator}` : '';
    }

    public async getAvatar(): Promise<void> {
        this.avatar = await this.rpc.getUserAvatar();
        this.username = await this.setUsername();
    }

    public onConnect(): void {
        this.rpc.connect().then(() => {
            this.getAvatar().catch();
        });
    }

    public onDisconnect(): void {
        this.avatar = '';
        this.username = '';
        this.rpc.destroy();
    }
}
