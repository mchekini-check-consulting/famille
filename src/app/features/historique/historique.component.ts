import { Component, OnInit, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { InfosIntervention } from "app/core/model/infosInterventions";
import { SearchService } from "app/core/service/recherche.service";

const ELEMENT_DATA: InfosIntervention[] = [];

@Component({
  selector: "app-historique",
  templateUrl: "./historique.component.html",
  styleUrls: ["./historique.component.scss"],
})
export class HistoriqueComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(private searchService: SearchService) {}

  listAllInterventions: InfosIntervention[] = [];

  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  dataSource = ELEMENT_DATA;

  ngOnInit(): void {
    this.searchService.getAllInterventions().subscribe((resp) => {
      this.listAllInterventions = [...resp];
    });
  }
}
