import {Component, OnInit} from '@angular/core';
import {authCodeFlowConfig} from "./auth.config";
import {OAuthService} from "angular-oauth2-oidc";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private oauthService: OAuthService) {
        if (!oauthService.hasValidIdToken()){
            this.oauthService.configure(authCodeFlowConfig);
            this.oauthService.loadDiscoveryDocumentAndLogin();
        }
    }

}
