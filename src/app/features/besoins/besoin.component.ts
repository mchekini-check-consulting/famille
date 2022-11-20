import { Component, OnInit } from "@angular/core";
import {
  Options,
  LabelType,
  ChangeContext,
  PointerType,
} from "@angular-slider/ngx-slider";

import { ToastrService } from "ngx-toastr";

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
  id: string;
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

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

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

  data: Data[] = [];

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

  handleBesoin(id: string, lowValue: number, highValue: number): void {
    const index = this.data.findIndex((e) => e.id == id);
    if (index == -1) {
      this.data.push({ id, value: true, lowValue, highValue });
    } else {
      this.data[index].value = !this.data[index].value;
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
