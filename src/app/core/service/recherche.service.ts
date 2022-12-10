import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Nounou } from "../model/nounou";
import { Intervention } from "../model/intervention";
import { DisponibiltesNounou } from "../model/disponibilites";
import { searchApiUrl, interventionApiUrl } from "../common";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getDisponibilitesNounou(email: string): Observable<DisponibiltesNounou[]> {
    return this.http.get<DisponibiltesNounou[]>(
      searchApiUrl + "/dispo-nounou?email=" + email
    );
  }

  getAllInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(
      interventionApiUrl + "/get-all-interventions"
    );
  }

  createIntervention(data: Intervention[]) {
    return this.http
      .post<Intervention[]>(interventionApiUrl + "/create", data)
      .pipe();
  }
}
