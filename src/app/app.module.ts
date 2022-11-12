import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { OAuthModule } from "angular-oauth2-oidc";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpRequestInterceptor } from "./core/interceptor/httpRequestInerceptor";

import { ToastrModule } from "ngx-toastr";
import { NgxUiLoaderModule } from "ngx-ui-loader";

import { MatCardModule } from "@angular/material/card";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    MatCardModule,
    OAuthModule.forRoot(),
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
