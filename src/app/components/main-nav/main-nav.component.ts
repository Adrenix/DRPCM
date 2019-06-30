import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { ElementsService } from '../../providers/elements.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
    selector: 'main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, AfterViewInit {
    @ViewChild('drawer', { static: true }) public drawer: MatDrawer;

    constructor(private service: ElementsService, private electron: ElectronService) {}

    public onAssets(): void {
        this.electron.shell.openExternal('https://discordapp.com/developers/applications/').catch();
    }

    ngOnInit() {
        window.$('.sidenav-content').niceScroll({
            cursorborder: '',
            cursorwidth: '10px',
            cursorcolor: '#424242',
            autohidemode: 'leave',
            enablekeyboard: false,
            railpadding: { top: 41, right: 0, left: 0, bottom: 42 }
        });
    }

    ngAfterViewInit() {
        this.service.drawer = this.drawer;
    }
}
