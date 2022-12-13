import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { TemplateComponent } from "./core/template/container/template.component";
import { BesoinComponent } from "./features/besoins/besoin.component";
import { RechercheComponent } from "./features/recherche/recherche.component";
import { MessagerieComponent } from "./features/messagerie/messagerie.component";
import { InfosComponent } from "./features/infos/infos.component";
import { HistoriqueComponent } from "./features/historique/historique.component";

const routes: Routes = [
  {
    path: "",
    component: TemplateComponent,
    children: [
      {
        path: "besoins",
        component: BesoinComponent,
      },
      {
        path: "recherche",
        component: RechercheComponent,
      },
      {
        path: "messagerie",
        component: MessagerieComponent,
      },
      {
        path: "messagerie/:id",
        component: MessagerieComponent,
      },
      {
        path: "infos",
        component: InfosComponent,
      },
      {
        path: "historique",
        component: HistoriqueComponent,
      },
    ],
  },
  { path: "home", component: TemplateComponent },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
