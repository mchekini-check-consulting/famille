export interface DetailIntervention {
  jour: string;
  matin: string;
  midi: string;
  soir: string;
}

export class InfosIntervention {
  nom: string;
  prenom: string;
  emailNounou: string;
  periode: string;
  etat: string;
  dateIntervention: string;
  detailIntervention: DetailIntervention;
}
