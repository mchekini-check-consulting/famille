import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { OAuthService } from "angular-oauth2-oidc";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private oauthService: OAuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const access_token = this.oauthService.getAccessToken();
    console.log(access_token);

    if (access_token != null) {
      req = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + access_token),
      });
    }

    return next.handle(req);
  }
}
