import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { OAuthService } from "angular-oauth2-oidc";

import { NgxUiLoaderService } from "ngx-ui-loader";
import { finalize } from "rxjs/operators";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private oauthService: OAuthService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  exludedUrls: string[] = [
    "/api/v1/famille/chat/get",
    "/api/v1/famille/chat/get-unread-msg",
    "/api/v1/famille/chat/get-unread-msg-by-nounou",
    "/api/v1/famille/chat/set-msg-read",
    "/api/v1/famille/intervention/get-all-interventions",
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    !this.exludedUrls.includes(req.url) && this.ngxLoader.start();
    const access_token = this.oauthService.getAccessToken();

    if (access_token != null) {
      req = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + access_token),
      });
    }

    return next.handle(req).pipe(finalize(() => this.ngxLoader.stop()));
  }
}
