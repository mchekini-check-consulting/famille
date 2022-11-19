import { Component, OnInit } from "@angular/core";
import { Options, LabelType } from "@angular-slider/ngx-slider";

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

  constructor() {}

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

  data: Data[] = [
    { id: "0mat", value: false },
    { id: "1mat", value: true },
    { id: "3soi", value: true },
    { id: "4mid", value: true },
  ];

  getValue(id: string): boolean {
    this.result = false;
    this.data.map((e) => {
      if (e.id == id) {
        this.result = e.value;
      }
    });
    return this.result;
  }

  valueMat: number = 7;
  highValueMat: number = 12;
  valueMid: number = 12;
  highValueMid: number = 18;
  valueSoi: number = 18;
  highValueSoi: number = 22;

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
          return value.toString();
        case LabelType.High:
          return value.toString();
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
