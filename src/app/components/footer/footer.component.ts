import { Component, HostListener } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { StoreService } from '../../providers/store.service';
import { RPCService } from '../../providers/rpc.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
    selector: 'footer-info-dialog',
    templateUrl: 'footer.info.dialog.html'
})
export class FooterInfoDialogComponent {
    constructor(private electron: ElectronService) {}

    public onSupport(): void {
        this.electron.shell.openExternal('https://discord.gg/jWdfVh3').catch();
    }
}

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    constructor(public store: StoreService,
                public rpc: RPCService,
                public dialog: MatDialog,
                public snackbar: MatSnackBar
    ) {}

    @HostListener('document:keydown', ['$event']) public onKeydownSave(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 's') {
            this.onSave();
        }
    }

    public openInfoDialog(): void {
        this.dialog.open(FooterInfoDialogComponent);
    }

    public openSnackBar(message: string, action: string, duration = 3000): void {
        this.snackbar.open(message, action, {
            duration: duration
        });
    }

    public onSave(): void {
        this.rpc.syncStore();
        this.store.save();
        this.openSnackBar('Saved RPC data.', 'Close');
    }
}
