import { Component, OnInit } from "@angular/core";
import { authCodeFlowConfig } from "./auth.config";
import { OAuthService } from "angular-oauth2-oidc";
import { OptionsService } from "./core/service/options.service";
import { Options } from "./core/model/options";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(
    private oauthService: OAuthService,
    private optionsService: OptionsService
  ) {
    if (!oauthService.hasValidIdToken()) {
      this.oauthService.configure(authCodeFlowConfig);
      this.oauthService.loadDiscoveryDocumentAndLogin();
    }
    this.optionsService.getOptionsFamille().subscribe((data: Options) => {
      localStorage.setItem("options-autosave", data.autosave.toString());
    });
  }
}
