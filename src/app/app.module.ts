import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app.routing';
import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";
import {OAuthModule} from "angular-oauth2-oidc";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        CoreModule,
        AppRoutingModule,
        OAuthModule.forRoot()
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
