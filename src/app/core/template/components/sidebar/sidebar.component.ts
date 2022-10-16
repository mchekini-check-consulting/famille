import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/besoins', title: 'Besoins',  icon: 'pe-7s-bell', class: '' },
    { path: '/recherche', title: 'Recherche',  icon: 'pe-7s-science', class: '' },
    { path: '/messagerie', title: 'Messagerie',  icon: 'pe-7s-graph', class: '' },
    { path: '/historique', title: 'Historique',  icon: 'pe-7s-map-marker', class: '' },
    { path: '/infos', title: 'Mes informations',  icon: 'pe-7s-note2', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
