import { Component, OnInit, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { InfosIntervention } from "app/core/model/infosInterventions";
import { SearchService } from "app/core/service/recherche.service";
import { InterventionService } from "app/core/service/historique.service";

import { ToastrService } from "ngx-toastr";

import { interval } from "rxjs/internal/observable/interval";
import { Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

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

  expanded: stateExpand[] = [];

  displayedColumns: string[] = ["position", "name", "weight", "symbol"];

  timeInterval: Subscription;

  afterCollapse(email: string): void {
    const index = this.expanded.findIndex((exp) => exp.email == email);
    if (index == -1) return;
    this.expanded[index].state = false;
  }

  afterExpand(email: string): void {
    const index = this.expanded.findIndex((exp) => exp.email == email);
    if (index == -1) return;
    this.expanded[index].state = true;
  }

  isExpand(email: string): boolean {
    console.log(this.expanded);
    const index = this.expanded.findIndex((exp) => exp.email == email);
    if (index == -1) return false;
    console.log(this.expanded[index].state);
    return this.expanded[index].state;
  }

  ngOnInit(): void {
    this.getAllInterventions();
    this.timeInterval = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.searchService.getAllInterventions())
      )
      .subscribe(
        (resp) => (
          (this.listAllInterventions = [...resp]), this.setStateExpand(resp)
        ),
        (err) => console.log("HTTP Error", err)
      );
  }

  setStateExpand(resp: InfosIntervention[]): void {
    // Vérifier pour les nouvelles insertions d'interventions
    resp.map((e) => {
      if (!this.expanded.find((exp) => exp.email == e.emailNounou)) {
        this.expanded.push({ email: e.emailNounou, state: false });
      }
    });
  }

  getAllInterventions(): void {
    this.searchService.getAllInterventions().subscribe((resp) => {
      this.listAllInterventions = [...resp];
      this.setStateExpand(resp);
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

interface stateExpand {
  email: string;
  state: boolean;
}
