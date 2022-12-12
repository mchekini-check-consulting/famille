import { Component, OnInit, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { InfosIntervention } from "app/core/model/infosInterventions";
import { SearchService } from "app/core/service/recherche.service";
import { InterventionService } from "app/core/service/historique.service";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-historique",
  templateUrl: "./historique.component.html",
  styleUrls: ["./historique.component.scss"],
})
export class HistoriqueComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private searchService: SearchService,
    private interventionService: InterventionService,
    private toastr: ToastrService
  ) {}

  listAllInterventions: InfosIntervention[] = [];

  displayedColumns: string[] = ["position", "name", "weight", "symbol"];

  ngOnInit(): void {
    this.getAllInterventions();
  }

  getAllInterventions(): void {
    this.searchService.getAllInterventions().subscribe((resp) => {
      this.listAllInterventions = [...resp];
    });
  }

  actionAnnuler(email: string): void {
    if (window.confirm("Etes vous sûr d'annuler la demande d'intervention ?")) {
      this.interventionService
        .cancelIntervention({ emailNounou: email })
        .subscribe((resp) => {
          this.listAllInterventions = [...resp];
        });
    }
  }

  actionRelancer(email: string): void {
    if (
      window.confirm("Etes vous sûr de relancer la demande d'intervention ?")
    ) {
      this.interventionService
        .relancerIntervention({ emailNounou: email })
        .subscribe((resp) => {
          this.listAllInterventions = [...resp];
        });
    }
  }

  actionRenouveler(): void {
    this.toastr.success("Action effectuée avec succès !");
  }
}
