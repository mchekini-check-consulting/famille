import { Component, OnInit } from "@angular/core";
import { Options, LabelType, ChangeContext } from "@angular-slider/ngx-slider";

import { ToastrService } from "ngx-toastr";
import { BesoinsService } from "../../core/service/besoins.service";
import { OptionsService } from "app/core/service/options.service";
import { BesoinsDay } from "app/core/model/besoins";

import { ComponentCanDeactivate } from "./pending-changes-guard";
import { HostListener } from "@angular/core";
import { Observable } from "rxjs";

export interface Header {
  color: string;
  text: string;
}

export interface Jours {
  color: string;
  text: string;
  id: number;
  bgData: string;
}

export interface Data {
  idBesoin: string;
  id: string;
  jour: number;
  value: boolean;
  lowValue: number;
  highValue: number;
}

export interface modelBesoins {
  idBesoin: string;
  jour: number;
  besoinMatinDebut: string;
  besoinMatinFin: string;
  besoinMidiDebut: string;
  besoinMidiFin: string;
  besoinSoirDebut: string;
  besoinSoirFin: string;
}

@Component({
  selector: "app-disponibilites",
  templateUrl: "./besoin.component.html",
  styleUrls: ["./besoin.component.scss"],
  styles: [
    `
      .box {
        border-radius: 5px;
        padding: 20px;
        font-size: 150%;
        border: 1px solid #000;
      }
    `,
  ],
})
export class BesoinComponent implements OnInit, ComponentCanDeactivate {
  result: boolean;
  autosave: boolean = false;
  resultVal: number;
  data: Data[] = [];
  initData: Data[] = [];
  changes: Data[] = [];
  initialBesoins: modelBesoins[] = [];

  constructor(
    private toastr: ToastrService,
    private besoinService: BesoinsService,
    private optionsService: OptionsService
  ) {}

  @HostListener("window:beforeunload")
  canDeactivate(): Observable<boolean> | boolean {
    return this.changes.length == 0 ? true : false;
  }

  headers: Header[] = [
    { text: "Matin", color: "lightpink" },
    { text: "Midi", color: "lightpink" },
    { text: "Soir", color: "lightpink" },
  ];

  jours: Jours[] = [
    { text: "Samedi", color: "mistyrose", id: 0, bgData: "" },
    { text: "Dimanche", color: "mistyrose", id: 1, bgData: "#EDF2F3" },
    { text: "Lundi", color: "mistyrose", id: 2, bgData: "" },
    { text: "Mardi", color: "mistyrose", id: 3, bgData: "#EDF2F3" },
    { text: "Mercredi", color: "mistyrose", id: 4, bgData: "" },
    { text: "Jeudi", color: "mistyrose", id: 5, bgData: "#EDF2F3" },
    { text: "Vendredi", color: "mistyrose", id: 6, bgData: "" },
  ];

  mapClass = {
    true: "btn btn-success active",
    false: "btn btn-default",
  };

  ngOnInit(): void {
    //this.autosave = localStorage.getItem("options-autosave") == "true" ? true : false;
    let localData = {
      idBesoin: null,
      id: null,
      jour: null,
      value: true,
      lowValue: null,
      highValue: null,
    };
    this.besoinService.getBesoins().subscribe((resp: any) => {
      this.initialBesoins = [...resp];
      this.data = this.data.filter((e) => !e.value); // Supprimer toutes les données validées
      resp.map((v: modelBesoins) => {
        if (v.besoinMatinDebut != null) {
          localData = {
            idBesoin: v.idBesoin,
            id: v.jour.toString() + "mat",
            jour: v.jour,
            value: true,
            lowValue: Number(v.besoinMatinDebut.substring(0, 2)),
            highValue: Number(v.besoinMatinFin.substring(0, 2)),
          };
          this.data.push(localData);
          this.initData.push(localData);
        }
        if (v.besoinMidiDebut != null) {
          localData = {
            idBesoin: v.idBesoin,
            id: v.jour.toString() + "mid",
            jour: v.jour,
            value: true,
            lowValue: Number(v.besoinMidiDebut.substring(0, 2)),
            highValue: Number(v.besoinMidiFin.substring(0, 2)),
          };
          this.data.push(localData);
          this.initData.push(localData);
        }
        if (v.besoinSoirDebut != null) {
          localData = {
            idBesoin: v.idBesoin,
            id: v.jour.toString() + "soi",
            jour: v.jour,
            value: true,
            lowValue: Number(v.besoinSoirDebut.substring(0, 2)),
            highValue: Number(v.besoinSoirFin.substring(0, 2)),
          };
          this.data.push(localData);
          this.initData.push(localData);
        }
      });
    });
  }

  handleAutoSave(): void {
    this.optionsService
      .updateOptionsFamille({ autosave: !this.autosave })
      .subscribe(() => {
        this.autosave = !this.autosave;
      });
  }

  saveAll(): void {
    if (this.changes.length == 0) {
      this.toastr.error(
        "Oups ! Il faut déclarer au minimum un besoin avant d’enregistrer"
      );
      return null;
    }
    this.changes = this.changes.filter((e) => {
      return e.lowValue != null && e.highValue != null;
    });

    let tabChangesToSave: BesoinsDay[] = [];
    this.changes.map((e) => {
      let per = e.id.slice(1);
      tabChangesToSave.push({
        idBesoin: e.idBesoin,
        jour: e.jour,
        besoinMatinDebut: !e.value ? null : per == "mat" ? e.lowValue : null,
        besoinMatinFin: !e.value ? null : per == "mat" ? e.highValue : null,
        besoinMidiDebut: !e.value ? null : per == "mid" ? e.lowValue : null,
        besoinMidiFin: !e.value ? null : per == "mid" ? e.highValue : null,
        besoinSoirDebut: !e.value ? null : per == "soi" ? e.lowValue : null,
        besoinSoirFin: !e.value ? null : per == "soi" ? e.highValue : null,
        type: per,
      });
    });
    this.besoinService.createBesoinAll(tabChangesToSave).subscribe({
      next: () => {
        this.changes = [];
        this.toastr.success("Données sauvegardées avec succès");
      },
      error: () =>
        this.toastr.error("Erreur lors de la modification. veuillez réessayer"),
    });
  }

  stateSaveAll(): boolean {
    if (this.changes.length == 0) return true;
    else return false;
  }

  changesLength(): boolean {
    if (this.changes.length > 1) return true;
    return false;
  }

  getValue(id: string): boolean {
    this.result = false;
    this.data.map((e) => {
      if (e.id == id) {
        this.result = e.value;
      }
    });
    return this.result;
  }

  getLowValue(id: string): number {
    this.resultVal = 0;
    this.data.map((e) => {
      if (e.id == id) {
        this.resultVal = e.lowValue;
      }
    });
    return this.resultVal;
  }

  getHighValue(id: string): number {
    this.resultVal = 0;
    this.data.map((e) => {
      if (e.id == id) {
        this.resultVal = e.highValue;
      }
    });
    return this.resultVal;
  }

  randomString(length: number): string {
    var randomChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  updateData(
    index: number,
    lowValue: number,
    highValue: number,
    localData: Data,
    refresh: boolean
  ): void {
    if (index == -1) {
      this.data.push(localData);
      this.changes.push(localData);
    } else {
      this.data[index].lowValue = lowValue;
      this.data[index].highValue = highValue;
      const index2 = this.changes.findIndex((e) => e.id == this.data[index].id);
      if (index2 == -1) this.changes.push(this.data[index]);
      else this.changes[index2] = this.data[index];
    }
    //if (refresh) this.initData = [...this.data];
  }

  equalsBesoins(currentChange: Data): boolean {
    for (var e of this.initialBesoins) {
      const matDeb = Number(
        e.besoinMatinDebut == null ? -1 : e.besoinMatinDebut.substring(0, 2)
      );
      const matFin = Number(
        e.besoinMatinFin == null ? -1 : e.besoinMatinFin.substring(0, 2)
      );
      const midDeb = Number(
        e.besoinMidiDebut == null ? -1 : e.besoinMidiDebut.substring(0, 2)
      );
      const midFin = Number(
        e.besoinMidiFin == null ? -1 : e.besoinMidiFin.substring(0, 2)
      );
      const soiDeb = Number(
        e.besoinSoirDebut == null ? -1 : e.besoinSoirDebut.substring(0, 2)
      );
      const soiFin = Number(
        e.besoinSoirFin == null ? -1 : e.besoinSoirFin.substring(0, 2)
      );
      if (
        e.jour == currentChange.jour &&
        ((matDeb == currentChange.lowValue &&
          matFin == currentChange.highValue) ||
          (midDeb == currentChange.lowValue &&
            midFin == currentChange.highValue) ||
          (soiDeb == currentChange.lowValue &&
            soiFin == currentChange.highValue))
      ) {
        return true;
      }
    }

    return false;
  }

  getBorderColor(id: string): string {
    const index = this.changes.findIndex((e) => e.id == id);

    if (index == -1) return "";
    if (this.equalsBesoins(this.changes[index])) return "";

    return "2px solid #F00";
  }

  handleBesoin(
    id: string,
    lowValue: number,
    highValue: number,
    updateRange: boolean
  ): void {
    const jour = +id[0];
    const index = this.data.findIndex((e) => e.jour == jour);
    const per = id.slice(1);
    if (index == -1) {
      // Insérer un nouveau besoin pour une journée qui n'a aucun besoin exprimé
      const besoin = {
        idBesoin: this.randomString(6),
        jour,
        besoinMatinDebut: per == "mat" ? lowValue : null,
        besoinMatinFin: per == "mat" ? highValue : null,
        besoinMidiDebut: per == "mid" ? lowValue : null,
        besoinMidiFin: per == "mid" ? highValue : null,
        besoinSoirDebut: per == "soi" ? lowValue : null,
        besoinSoirFin: per == "soi" ? highValue : null,
        type: null,
      };
      const localData = {
        idBesoin: besoin.idBesoin,
        id,
        jour,
        value: true,
        lowValue,
        highValue,
      };
      this.autosave
        ? this.besoinService.createBesoinDay(besoin).subscribe(() => {
            this.data.push(localData);
            //this.initData = [...this.data];
          })
        : this.data.push(localData);
      this.changes.push(localData);
    } else {
      // Il existe au moins un besoin exprimé pour la journée
      const idBesoin = this.data[index].idBesoin;
      const index2 = this.data.findIndex((e) => e.id == id);
      if (index2 == -1 || updateRange) {
        // Insérer un nouveau besoin pour une journée qui a déja un besoin
        const localData = {
          idBesoin, // Avoir le même id pour le même jour
          id,
          jour,
          value: true,
          lowValue,
          highValue,
        };

        switch (per) {
          case "mat":
            const besoinMat = {
              idBesoin,
              jour,
              besoinMatinDebut: lowValue,
              besoinMatinFin: highValue,
              type: "mat",
            };
            this.autosave
              ? this.besoinService
                  .createBesoinMatin(besoinMat)
                  .subscribe(() =>
                    this.updateData(
                      index2,
                      lowValue,
                      highValue,
                      localData,
                      true
                    )
                  )
              : this.updateData(index2, lowValue, highValue, localData, false);
            break;
          case "mid":
            const besoinMidi = {
              idBesoin,
              jour,
              besoinMidiDebut: lowValue,
              besoinMidiFin: highValue,
              type: "mid",
            };
            this.autosave
              ? this.besoinService
                  .createBesoinMidi(besoinMidi)
                  .subscribe(() =>
                    this.updateData(
                      index2,
                      lowValue,
                      highValue,
                      localData,
                      true
                    )
                  )
              : this.updateData(index2, lowValue, highValue, localData, false);
            break;
          case "soi":
            const besoinSoir = {
              idBesoin,
              jour,
              besoinSoirDebut: lowValue,
              besoinSoirFin: highValue,
              type: "soi",
            };
            this.autosave
              ? this.besoinService
                  .createBesoinSoir(besoinSoir)
                  .subscribe(() =>
                    this.updateData(
                      index2,
                      lowValue,
                      highValue,
                      localData,
                      true
                    )
                  )
              : this.updateData(index2, lowValue, highValue, localData, false);
            break;
          default:
            console.log("Erreur inattendue");
        }
      } else {
        // Modifier un besoin (le supprimer de la BDD)
        const idBesoin = this.data[index].idBesoin;
        switch (per) {
          case "mat":
            const besoinMat = {
              idBesoin,
              jour,
              besoinMatinDebut: null,
              besoinMatinFin: null,
              type: "mat",
            };
            if (this.autosave)
              this.besoinService.createBesoinMatin(besoinMat).subscribe(() => {
                this.data[index2].value = !this.data[index2].value;
                //this.initData = [...this.data];
              });
            else {
              this.data[index2].value = !this.data[index2].value;
            }
            break;
          case "mid":
            const besoinMidi = {
              idBesoin,
              jour,
              besoinMidiDebut: null,
              besoinMidiFin: null,
              type: "mid",
            };
            if (this.autosave)
              this.besoinService.createBesoinMidi(besoinMidi).subscribe(() => {
                this.data[index2].value = !this.data[index2].value;
                //this.initData = [...this.data];
              });
            else {
              this.data[index2].value = !this.data[index2].value;
            }
            break;
          case "soi":
            const besoinSoir = {
              idBesoin,
              jour,
              besoinSoirDebut: null,
              besoinSoirFin: null,
              type: "soi",
            };
            this.autosave
              ? this.besoinService
                  .createBesoinSoir(besoinSoir)
                  .subscribe(() => {
                    this.data[index2].value = !this.data[index2].value;
                    //this.initData = [...this.data];
                  })
              : (this.data[index2].value = !this.data[index2].value);
            break;
          default:
            console.log("Erreur inattendue");
        }
        // Apporter les changements
        const index3 = this.changes.findIndex((e) => e.id == id);
        if (index3 == -1) this.changes.push(this.data[index2]);
        else this.changes.splice(index3, 1);
      }
    }
  }

  getChangeContextString(changeContext: ChangeContext, id: string): void {
    const index = this.data.findIndex((e) => e.id == id);
    if (index == -1) {
      // Ce cas ne doit pas survenir puisque si le slide est visible donc l'id recherché existe dansle tab data
      this.toastr.error(
        "Une erreur inconnue est survenue. Veuillez réessayer ou réactualiser la page !",
        "Modification"
      );
    } else {
      this.handleBesoin(id, changeContext.value, changeContext.highValue, true);
      if (changeContext.value == changeContext.highValue) {
        // Eviter que les deux valeurs soient identiques
        let val = this.data[index].lowValue;
        this.data[index].lowValue = this.data[index].highValue;
        this.data[index].highValue = val;
      }
    }
  }

  options: Options = {
    step: 1,
    showTicks: true,
    showSelectionBar: true,
    selectionBarGradient: {
      from: "white",
      to: "#FC0",
    },
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value.toString() + "h";
        case LabelType.High:
          return value.toString() + "h";
        default:
          return "";
      }
    },
  };

  optionsMat: Options = {
    ...this.options,
    floor: 7,
    ceil: 12,
  };

  optionsMid: Options = {
    ...this.options,
    floor: 12,
    ceil: 18,
  };

  optionsSoi: Options = {
    ...this.options,
    floor: 18,
    ceil: 22,
  };
}
