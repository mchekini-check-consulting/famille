export class BesoinsDay {
  id_besoin: string;
  jour: number;
  besoin_matin_debut: number;
  besoin_matin_fin: number;
  besoin_midi_debut: number;
  besoin_midi_fin: number;
  besoin_soir_debut: number;
  besoin_soir_fin: number;
}

export class BesoinsMatin {
  id_besoin: string;
  jour: number;
  besoin_matin_debut: number;
  besoin_matin_fin: number;
  type: string;
}

export class BesoinsMidi {
  id_besoin: string;
  jour: number;
  besoin_midi_debut: number;
  besoin_midi_fin: number;
  type: string;
}

export class BesoinsSoir {
  id_besoin: string;
  jour: number;
  besoin_soir_debut: number;
  besoin_soir_fin: number;
  type: string;
}
