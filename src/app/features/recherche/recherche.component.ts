import {
  AfterViewInit,
  Component,
  ViewChild,
  Inject,
  Injectable,
} from "@angular/core";

import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";

import { BesoinsService } from "../../core/service/besoins.service";
import { SearchService } from "app/core/service/recherche.service";

import { Intervention } from "app/core/model/intervention";
import { DisponibiltesNounou } from "app/core/model/disponibilites";
import { Nounou } from "app/core/model/nounou";
import { InfosIntervention } from "app/core/model/infosInterventions";

import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class SharedService {
  email = "";
  listAllInterventions: InfosIntervention[] = [];
}

@Component({
  selector: "app-recherche",
  templateUrl: "./recherche.component.html",
  styleUrls: ["./recherche.component.scss"],
})
export class RechercheComponent implements AfterViewInit {
  myForm = new FormGroup({
    nom: new FormControl(""),
    prenom: new FormControl(""),
    ville: new FormControl(""),
    jour: new FormControl(""),
    heureDebut: new FormControl(""),
    heureFin: new FormControl(""),
  });

  data: Nounou[] = [];

  displayedColumns: string[] = [
    "nom",
    "prenom",
    "adresse",
    "telephone",
    "mail",
    "contact",
  ];

  jours: string[] = [
    "Samedi",
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
  ];

  dataSource = new MatTableDataSource<Nounou>(this.data);
  closeResult: string;

  constructor(
    private http: HttpClient,
    private _router: Router,
    public dialog: MatDialog,
    private searchService: SearchService,
    private sharedService: SharedService,
    private toastr: ToastrService
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.searchNounouByCriteria();
    this.getAllInterventions();
  }

  openDialog(email: string) {
    this.sharedService.email = email;
    this.dialog.open(DialogElements, { disableClose: true });
  }

  ngOnInit(): void {}

  searchNounouByCriteria() {
    const nom = this.myForm.get("nom").value;
    const prenom = this.myForm.get("prenom").value;
    const ville = this.myForm.get("ville").value;
    const jour =
      this.myForm.get("jour").value === "" ? -1 : this.myForm.get("jour").value;
    const heureDebut = this.myForm.get("heureDebut").value;
    const heureFin = this.myForm.get("heureFin").value;
    if (heureDebut && heureFin && heureFin < heureDebut) {
      this.toastr.error(
        "L'heure de fin ne peut pas être inférieure à l'heure de début"
      );
      return;
    }
    this.http
      .get<Nounou[]>(
        "api/v1/search/nounou?nom=" +
          nom +
          "&prenom=" +
          prenom +
          "&ville=" +
          ville +
          "&jour=" +
          jour +
          "&heureDebut=" +
          heureDebut +
          "&heureFin=" +
          heureFin
      )
      .subscribe((resp) => {
        console.log(resp);
        this.data = resp;
        this.dataSource = new MatTableDataSource<Nounou>(this.data);
      });
  }

  getAllInterventions() {
    this.searchService.getAllInterventions().subscribe((resp) => {
      this.sharedService.listAllInterventions = [...resp];
    });
  }

  goToChat(email: string): void {
    this._router.navigate(["/messagerie", email]);
  }

  checkDisabled(email: string): boolean {
    return this.sharedService.listAllInterventions.some(
      (e) => e.emailNounou == email
    );
  }
}

@Component({
  selector: "dialog-elements",
  templateUrl: "./dialog-elements.html",
})
export class DialogElements {
  isLinear = true;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  minDate = new Date();

  jours = new FormControl();

  jourList: string[] = [
    "Samedi",
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
  ];

  displayedColumns: string[] = [
    "demo-name",
    "demo-matin",
    "demo-midi",
    "demo-soir",
  ];

  dataSource: PeriodicElement[] = [];

  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private besoinService: BesoinsService,
    private searchService: SearchService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this._locale = "fr";
    this._adapter.setLocale(this._locale);
  }

  ngOnInit() {
    this.besoinService
      .getBesoins()
      .subscribe(async (resp: BesoinsFamille[]) => {
        await this.setJours(resp.sort((a, b) => a.jour - b.jour));
        this.searchService
          .getDisponibilitesNounou(this.sharedService.email)
          .subscribe((resp) => {
            this.setDisponibilitesNounou(resp);
          });
      });
  }

  saveIntervention(): void {
    if (this.range.value.start == null || this.range.value.end == null) {
      this.toastr.error("Veuillez selectionner une période valide !");
      return;
    }
    if (!this.dataSource.some((e) => e.matin || e.midi || e.soir)) {
      this.toastr.error("Veuillez selectionner au moins une intervention !");
      return;
    }
    if (window.confirm("Etes vous sûr de soumettre cette intervention ?")) {
      let dataIntervention: Intervention[] = [];
      this.dataSource.map((d) => {
        if (d.matin || d.midi || d.soir) {
          dataIntervention.push({
            timeIntervention: null,
            debutIntervention: this.range.value.start,
            finIntervention: this.range.value.end,
            jour: d.name,
            matin: d.rangeMat == "" ? " -- " : d.rangeMat,
            midi: d.rangeMid == "" ? " -- " : d.rangeMid,
            soir: d.rangeSoi == "" ? " -- " : d.rangeSoi,
            emailFamille: "",
            emailNounou: this.sharedService.email,
            etat: "Instance",
          });
        }
      });
      this.searchService
        .createIntervention(dataIntervention)
        .subscribe(async (resp: any) => {
          this.toastr.success("Intervention enregistrée avec succès !");
          //this.sharedService.listAllInterventions.push(...dataIntervention);
          console.log(this.sharedService.listAllInterventions);
          this.dialog.closeAll();
        });
    }
  }

  setJours(values: BesoinsFamille[]) {
    let data: PeriodicElement = null;
    return new Promise((resolve, reject) => {
      values.map((v) => {
        data = {
          jour: v.jour,
          name: "",
          matin: false,
          midi: false,
          soir: false,
          rangeMat: "",
          rangeMid: "",
          rangeSoi: "",
          dispoMat: false,
          dispoMid: false,
          dispoSoi: false,
        };
        let getRange = this.insertData(v);
        data.rangeMat = getRange.rangeMat;
        data.rangeMid = getRange.rangeMid;
        data.rangeSoi = getRange.rangeSoi;
        switch (v.jour) {
          case 0:
            data.name = "Samedi";
            break;
          case 1:
            data.name = "Dimanche";
            break;
          case 2:
            data.name = "Lundi";
            break;
          case 3:
            data.name = "Mardi";
            break;
          case 4:
            data.name = "Mercredi";
            break;
          case 5:
            data.name = "Jeudi";
            break;
          case 6:
            data.name = "Vendredi";
            break;
          default:
            break;
        }
        this.dataSource.push(data);
        resolve(this.dataSource);
      });
    });
  }

  setDisponibilitesNounou(data: DisponibiltesNounou[]): void {
    this.dataSource.map((d, i) => {
      const index = data.findIndex((e) => e.jour == d.jour);
      if (index != -1) {
        this.setValueCheckedJour(i, data[index]);
      }
    });
  }

  setValueCheckedJour(index: number, dispo: DisponibiltesNounou): void {
    this.dataSource[index].dispoMat =
      dispo.dateDebutMatin == null && dispo.dateFinMatin == null ? false : true;
    this.dataSource[index].dispoMid =
      dispo.dateDebutMidi == null && dispo.dateFinMidi == null ? false : true;
    this.dataSource[index].dispoSoi =
      dispo.dateDebutSoir == null && dispo.dateFinSoir == null ? false : true;
  }

  insertData(value: BesoinsFamille): any {
    return {
      rangeMat:
        value.besoinMatinDebut == null
          ? ""
          : value.besoinMatinDebut.slice(0, 2) +
            "h - " +
            value.besoinMatinFin.slice(0, 2) +
            "h",
      rangeMid:
        value.besoinMidiDebut == null
          ? ""
          : value.besoinMidiDebut.slice(0, 2) +
            "h - " +
            value.besoinMidiFin.slice(0, 2) +
            "h",
      rangeSoi:
        value.besoinSoirDebut == null
          ? ""
          : value.besoinSoirDebut.slice(0, 2) +
            "h - " +
            value.besoinSoirFin.slice(0, 2) +
            "h",
    };
  }

  handleValue(jour: string, type: string): void {
    const index = this.dataSource.findIndex((e) => e.name == jour);
    if (index == -1) alert("Erreur inconnue !");
    else {
      if (type == "mat")
        this.dataSource[index].matin = !this.dataSource[index].matin;
      if (type == "mid")
        this.dataSource[index].midi = !this.dataSource[index].midi;
      if (type == "soi")
        this.dataSource[index].soir = !this.dataSource[index].soir;
    }
  }
}

export interface PeriodicElement {
  jour: number;
  name: string;
  matin: boolean;
  midi: boolean;
  soir: boolean;
  rangeMat: string;
  rangeMid: string;
  rangeSoi: string;
  dispoMat: boolean;
  dispoMid: boolean;
  dispoSoi: boolean;
}

export interface BesoinsFamille {
  besoinMatinDebut: string;
  besoinMatinFin: string;
  besoinMidiDebut: string;
  besoinMidiFin: string;
  besoinSoirDebut: string;
  besoinSoirFin: string;
  emailFamille: string;
  iBesoin: string;
  jour: number;
}
