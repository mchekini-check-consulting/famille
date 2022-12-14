import { Component, OnInit } from "@angular/core";
import { interval } from "rxjs/internal/observable/interval";
import { Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

import { ChatService } from "../../../service/chat.service";
import { OAuthService } from "angular-oauth2-oidc";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/besoins", title: "Besoins", icon: "pe-7s-bell", class: "" },
  { path: "/recherche", title: "Recherche", icon: "pe-7s-science", class: "" },
  { path: "/messagerie", title: "Messagerie", icon: "pe-7s-graph", class: "" },
  {
    path: "/historique",
    title: "Interventions",
    icon: "pe-7s-map-marker",
    class: "",
  },
  { path: "/infos", title: "Mes informations", icon: "pe-7s-note2", class: "" },
  { path: "/admin", title: "Administration", icon: "pe-7s-note2", class: "" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  unread_messages: Number = 0;
  isAdmin: Boolean = false;

  timeInterval: Subscription;

  constructor(
    private chatService: ChatService,
    private oauthService: OAuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.oauthService.getIdentityClaims()["role"] == "admin";

    this.timeInterval = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.chatService.getUnreadMessages())
      )
      .subscribe(
        (resp) => (this.unread_messages = resp),
        (err) => console.log("HTTP Error", err)
      );
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
