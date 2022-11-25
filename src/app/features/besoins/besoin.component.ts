import { Component, OnInit } from "@angular/core";
import {
  Options,
  LabelType,
  ChangeContext,
  PointerType,
} from "@angular-slider/ngx-slider";

import { ToastrService } from "ngx-toastr";
import { BesoinsService } from "../../core/service/besoins.service";
import { BesoinsDay } from "app/core/model/besoins";

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
  id_besoin: string;
  id: string;
  jour: number;
  value: boolean;
  lowValue: number;
  highValue: number;
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
export class BesoinComponent implements OnInit {
  result: boolean;
  resultVal: number;
  data: Data[] = [];

  constructor(
    private toastr: ToastrService,
    private besoinService: BesoinsService
  ) {}

  ngOnInit(): void {
    this.besoinService.getBesoins().subscribe((resp: any) => {
      this.data = this.data.filter((e) => !e.value); // Supprimer toutes les données validées
      resp.map((v) => {
        if (v.besoin_matin_debut != null) {
          this.data.push({
            id_besoin: v.id_besoin,
            id: v.jour.toString() + "mat",
            jour: v.jour,
            value: true,
            lowValue: Number(v.besoin_matin_debut.substring(0, 2)),
            highValue: Number(v.besoin_matin_fin.substring(0, 2)),
          });
        }

        if (v.besoin_midi_debut != null) {
          this.data.push({
            id_besoin: v.id_besoin,
            id: v.jour.toString() + "mid",
            jour: v.jour,
            value: true,
            lowValue: Number(v.besoin_midi_debut.substring(0, 2)),
            highValue: Number(v.besoin_midi_fin.substring(0, 2)),
          });
        }
        if (v.besoin_soir_debut != null) {
          this.data.push({
            id_besoin: v.id_besoin,
            id: v.jour.toString() + "soi",
            jour: v.jour,
            value: true,
            lowValue: Number(v.besoin_soir_debut.substring(0, 2)),
            highValue: Number(v.besoin_soir_fin.substring(0, 2)),
          });
        }
      });
    });
  }

  headers: Header[] = [
    { text: "Matin", color: "lightgreen" },
    { text: "Midi", color: "#DDBDF1" },
    { text: "Soir", color: "lightpink" },
  ];

  jours: Jours[] = [
    { text: "Samedi", color: "lightpink", id: 0, bgData: "" },
    { text: "Dimanche", color: "#DDBDF1", id: 1, bgData: "#EDF2F3" },
    { text: "Lundi", color: "lightgreen", id: 2, bgData: "" },
    { text: "Mardi", color: "lightblue", id: 3, bgData: "#EDF2F3" },
    { text: "Mercredi", color: "lightpink", id: 4, bgData: "" },
    { text: "Jeudi", color: "#DDBDF1", id: 5, bgData: "#EDF2F3" },
    { text: "Vendredi", color: "lightgreen", id: 6, bgData: "" },
  ];

  mapClass = {
    true: "btn btn-success active",
    false: "btn btn-default",
  };

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
    localData: Data
  ): void {
    if (index == -1) this.data.push(localData);
    else {
      this.data[index].lowValue = lowValue;
      this.data[index].highValue = highValue;
    }
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
        id_besoin: this.randomString(6),
        jour,
        besoin_matin_debut: per == "mat" ? lowValue : null,
        besoin_matin_fin: per == "mat" ? highValue : null,
        besoin_midi_debut: per == "mid" ? lowValue : null,
        besoin_midi_fin: per == "mid" ? highValue : null,
        besoin_soir_debut: per == "soi" ? lowValue : null,
        besoin_soir_fin: per == "soi" ? highValue : null,
      };
      this.besoinService.createBesoinDay(besoin).subscribe(() =>
        this.data.push({
          id_besoin: besoin.id_besoin,
          id,
          jour,
          value: true,
          lowValue,
          highValue,
        })
      );
    } else {
      // Il existe au moins un besoin exprimé pour la journée
      const id_besoin = this.data[index].id_besoin;
      const index2 = this.data.findIndex((e) => e.id == id);
      if (index2 == -1 || updateRange) {
        // Insérer un nouveau besoin pour une journée qui a déja un besoin
        const localData = {
          id_besoin, // Avoir le même id pour le même jour
          id,
          jour,
          value: true,
          lowValue,
          highValue,
        };

        switch (per) {
          case "mat":
            const besoinMat = {
              id_besoin,
              jour,
              besoin_matin_debut: lowValue,
              besoin_matin_fin: highValue,
              type: "matin",
            };
            this.besoinService
              .createBesoinMatin(besoinMat)
              .subscribe(() =>
                this.updateData(index2, lowValue, highValue, localData)
              );
            break;
          case "mid":
            const besoinMidi = {
              id_besoin,
              jour,
              besoin_midi_debut: lowValue,
              besoin_midi_fin: highValue,
              type: "midi",
            };
            this.besoinService
              .createBesoinMidi(besoinMidi)
              .subscribe(() =>
                this.updateData(index2, lowValue, highValue, localData)
              );
            break;
          case "soi":
            const besoinSoir = {
              id_besoin,
              jour,
              besoin_soir_debut: lowValue,
              besoin_soir_fin: highValue,
              type: "soir",
            };
            this.besoinService
              .createBesoinSoir(besoinSoir)
              .subscribe(() =>
                this.updateData(index2, lowValue, highValue, localData)
              );
            break;
          default:
            console.log("Erreur inattendue");
        }
      } else {
        console.log("Modifier un besoin (le supprimer de la BDD");
        console.log(this.data);
        // Modifier un besoin (le supprimer de la BDD)
        const id_besoin = this.data[index].id_besoin;

        switch (per) {
          case "mat":
            const besoinMat = {
              id_besoin,
              jour,
              besoin_matin_debut: null,
              besoin_matin_fin: null,
              type: "matin",
            };
            this.besoinService
              .createBesoinMatin(besoinMat)
              .subscribe(
                () => (this.data[index2].value = !this.data[index2].value)
              );
            break;
          case "mid":
            const besoinMidi = {
              id_besoin,
              jour,
              besoin_midi_debut: null,
              besoin_midi_fin: null,
              type: "midi",
            };
            this.besoinService
              .createBesoinMidi(besoinMidi)
              .subscribe(
                () => (this.data[index2].value = !this.data[index2].value)
              );
            break;
          case "soi":
            const besoinSoir = {
              id_besoin,
              jour,
              besoin_soir_debut: null,
              besoin_soir_fin: null,
              type: "soir",
            };
            this.besoinService
              .createBesoinSoir(besoinSoir)
              .subscribe(
                () => (this.data[index2].value = !this.data[index2].value)
              );
            break;
          default:
            console.log("Erreur inattendue");
        }
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
      if (changeContext.value != changeContext.highValue) {
        this.data[index].lowValue = changeContext.value;
        this.data[index].highValue = changeContext.highValue;
      } else {
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
