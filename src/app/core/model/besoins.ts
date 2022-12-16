export class BesoinsDay {
  idBesoin: string;
  jour: number;
  besoinMatinDebut: number;
  besoinMatinFin: number;
  besoinMidiDebut: number;
  besoinMidiFin: number;
  besoinSoirDebut: number;
  besoinSoirFin: number;
  type: string;
}

export class BesoinsMatin {
  idBesoin: string;
  jour: number;
  besoinMatinDebut: number;
  besoinMatinFin: number;
  type: string;
}

export class BesoinsMidi {
  idBesoin: string;
  jour: number;
  besoinMidiDebut: number;
  besoinMidiFin: number;
  type: string;
}

export class BesoinsSoir {
  idBesoin: string;
  jour: number;
  besoinSoirDebut: number;
  besoinSoirFin: number;
  type: string;
}
