import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { OAuthModule } from "angular-oauth2-oidc";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpRequestInterceptor } from "./core/interceptor/httpRequestInterceptor";

import { ToastrModule } from "ngx-toastr";
import { NgxUiLoaderModule } from "ngx-ui-loader";

import { DatePipe } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatExpansionModule } from "@angular/material/expansion";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatExpansionModule,
  ],
  declarations: [AppComponent],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
