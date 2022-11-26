import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  BesoinsDay,
  BesoinsMatin,
  BesoinsMidi,
  BesoinsSoir,
} from "../model/besoins";
import { besoinsApiUrl } from "../common";

@Injectable({
  providedIn: "root",
})
export class BesoinsService {
  constructor(private http: HttpClient) {}

  createBesoinAll(data: BesoinsDay[]): Observable<BesoinsDay[]> {
    return this.http
      .put<BesoinsDay[]>(besoinsApiUrl + "/update-all", data)
      .pipe();
  }

  createBesoinDay(data: BesoinsDay): Observable<BesoinsDay> {
    return this.http.post<BesoinsDay>(besoinsApiUrl + "/create", data).pipe();
  }

  createBesoinMatin(data: BesoinsMatin): Observable<BesoinsMatin> {
    return this.http.put<BesoinsMatin>(besoinsApiUrl + "/update", data).pipe();
  }

  createBesoinMidi(data: BesoinsMidi): Observable<BesoinsMidi> {
    return this.http.put<BesoinsMidi>(besoinsApiUrl + "/update", data).pipe();
  }

  createBesoinSoir(data: BesoinsSoir): Observable<BesoinsSoir> {
    return this.http.put<BesoinsSoir>(besoinsApiUrl + "/update", data).pipe();
  }

  getBesoins(): Observable<any> {
    return this.http.get<any>(besoinsApiUrl);
  }

  deleteBesoin(id: string): Observable<BesoinsDay> {
    return this.http.delete<BesoinsDay>(besoinsApiUrl + "/delete/" + id);
  }
}
