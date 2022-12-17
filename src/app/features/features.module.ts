import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { BesoinComponent } from "./besoins/besoin.component";
import {
  RechercheComponent,
  DialogElements,
} from "./recherche/recherche.component";
import { MessagerieComponent } from "./messagerie/messagerie.component";
import { HistoriqueComponent } from "./historique/historique.component";
import { InfosComponent } from "./infos/infos.component";
import { NotificationComponent } from "./notifications/notification.component";
import { MatCardModule } from "@angular/material/card";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { AdministrationComponent } from './administration/administration.component';
import {ConfirmationDialogComponent} from "./confirmation-dialog/confirmation-dialog.component";

@NgModule({
  declarations: [
    BesoinComponent,
    RechercheComponent,
    MessagerieComponent,
    HistoriqueComponent,
    InfosComponent,
    NotificationComponent,
    DialogElements,
    AdministrationComponent,
    ConfirmationDialogComponent
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
    MatPaginatorModule,
    MatDialogModule,
    MatStepperModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
  ],
})
export class FeaturesModule {}
