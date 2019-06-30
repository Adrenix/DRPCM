import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// Angular Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Angular Services
import { ElectronService } from './providers/electron.service';
import { RPCService } from './providers/rpc.service';
import { ShepherdService } from 'angular-shepherd';

// Angular Directives
import { WebviewDirective } from './directives/webview.directive';


// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RPCMaterialModule } from './app.material';
import {
    MatSnackBar,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    ErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher
} from '@angular/material';
import { FooterComponent, FooterInfoDialogComponent } from './components/footer/footer.component';
import { WalkthroughComponent } from './components/walkthrough/walkthrough.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { RPCComponent, RPCHelpComponent} from './components/dashboard/rpc/rpc.component';
import { UserComponent, UserHelpComponent } from './components/dashboard/user/user.component';
import { TextComponent, TextHelpComponent } from './components/dashboard/text/text.component';
import { ImageComponent, ImageHelpComponent } from './components/dashboard/image/image.component';
import { ConnectionErrorComponent, RPCErrorComponent } from './providers/rpc.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WebviewDirective,
        MainNavComponent,
        FooterComponent,
        FooterInfoDialogComponent,
        ConnectionErrorComponent,
        RPCErrorComponent,
        WalkthroughComponent,
        DashboardComponent,
        TitlebarComponent,
        RPCComponent,
        RPCHelpComponent,
        UserComponent,
        UserHelpComponent,
        TextComponent,
        TextHelpComponent,
        ImageComponent,
        ImageHelpComponent
    ],

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        LayoutModule,
        RPCMaterialModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule
    ],

    entryComponents: [
        FooterInfoDialogComponent,
        ConnectionErrorComponent,
        RPCErrorComponent,
        RPCHelpComponent,
        UserHelpComponent,
        ImageHelpComponent,
        TextHelpComponent
    ],

    providers: [
        ElectronService,
        RPCService,
        ShepherdService,
        MatSnackBar,
        {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
    ],

    bootstrap: [AppComponent]
})
export class AppModule {}
