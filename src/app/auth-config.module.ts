import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        AuthModule.forRoot({
            config: {
                authority: 'http://54.83.239.110:10000/auth/realms/famille',
                redirectUrl: window.location.origin,
                postLogoutRedirectUri: window.location.origin,
                clientId: 'famille',
                scope: 'openid profile email offline_access',
                responseType: 'code',
                silentRenew: false,
                // autoUserInfo: true,
                useRefreshToken: false,
                renewTimeBeforeTokenExpiresInSeconds: 10,
                logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
            },
        }),
    ],
    exports: [AuthModule],
})
export class AuthConfigModule {}
