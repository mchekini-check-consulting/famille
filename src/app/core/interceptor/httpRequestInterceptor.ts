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

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.ngxLoader.start();
    const access_token = this.oauthService.getAccessToken();

    if (access_token != null) {
      req = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + access_token),
      });
    }

    return next.handle(req).pipe(finalize(() => this.ngxLoader.stop()));
  }
}
