import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {BesoinComponent} from "./besoins/besoin.component";
import {RechercheComponent} from "./recherche/recherche.component";
import {MessagerieComponent} from "./messagerie/messagerie.component";
import {HistoriqueComponent} from "./historique/historique.component";
import {InfosComponent} from "./infos/infos.component";
import {MatCardModule} from "@angular/material/card";
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/compiler";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatChipsModule} from "@angular/material/chips";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
    declarations: [
        BesoinComponent,
        RechercheComponent,
        MessagerieComponent,
        HistoriqueComponent,
        InfosComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        NgxSliderModule,
        MatCheckboxModule,
        MatButtonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule
    ]
})
export class FeaturesModule {
}
