import { AfterViewInit, Component } from '@angular/core';
import { RPCService } from '../../providers/rpc.service';
import { MatDialog } from '@angular/material';
import { RPCHelpComponent } from './rpc/rpc.component';
import { UserHelpComponent } from './user/user.component';
import { ImageHelpComponent } from './image/image.component';
import { TextHelpComponent } from './text/text.component';
import { ShepherdService } from 'angular-shepherd';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
    constructor(private rpc: RPCService, private tutorial: ShepherdService, public dialog: MatDialog) {}

    public cards = [
        {
            title: 'RPC', icon: 'games',
            cols: 1, rows: 1,
            id: 'rpc',
            buttons: [
                {
                    title: 'Save RPC',
                    icon: 'save',
                    click: () => this.rpc.syncStore()
                },
                {
                    title: 'Reset RPC',
                    icon: 'refresh',
                    click: () => this.rpc.reset()
                },
                {
                    divide: true,
                    title: 'Help',
                    icon: 'help',
                    click: () => this.dialog.open(RPCHelpComponent)
                }
            ]
        },
        {
            title: 'Client', icon: 'account_circle',
            cols: 1, rows: 1,
            id: 'user',
            buttons: [
                {
                    title: 'Clear Identifier',
                    icon: 'clear',
                    click: () => this.rpc.clearClientFields()
                },
                {
                    divide: true,
                    title: 'Help',
                    icon: 'help',
                    click: () => this.dialog.open(UserHelpComponent)
                }
            ]
        },
        {
            title: 'Text', icon: 'sort',
            cols: 1, rows: 2,
            id: 'text',
            buttons: [
                {
                    title: 'Clear Fields',
                    icon: 'clear',
                    click: () => this.rpc.clearTextFields()
                },
                {
                    divide: true,
                    title: 'Help',
                    icon: 'help',
                    click: () => this.dialog.open(TextHelpComponent)
                }
            ]
        },
        {
            title: 'Image', icon: 'photo',
            cols: 1, rows: 1,
            id: 'image',
            buttons: [
                {
                    title: 'Clear Fields',
                    icon: 'clear',
                    click: () => this.rpc.clearImageFields()
                },
                {
                    divide: true,
                    title: 'Help',
                    icon: 'help',
                    click: () => this.dialog.open(ImageHelpComponent)
                }
            ]
        }
    ];

    ngAfterViewInit(): void {
        this.tutorial.disableScroll = true;
        this.tutorial.modal = true;
        this.tutorial.addSteps([
            {
                id: 'intro',
                options: {
                    attachTo: 'body'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-secondary',
                        text: 'Exit',
                        type: 'cancel'
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Back',
                        type: 'back'
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Next',
                        type: 'next'
                    }
                ],
                scrollTo: false,
                showCancelLink: true,
                title: 'Welcome to DRPCM!',
                text: ['A new way to approach custom discord RPC management.']
            }
        ]);
        // this.tutorial.start();
    }
}
