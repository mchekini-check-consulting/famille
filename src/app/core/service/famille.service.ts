import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Famille } from "../model/famille";
import { familleApiUrl } from "../common";

@Injectable({
  providedIn: "root",
})
export class FamilleService {
  constructor(private http: HttpClient) {}

  getFamille(): Observable<Famille> {
    return this.http.get<Famille>(familleApiUrl + "/get");
  }

  putFamille(data: Famille) {
    return this.http.put<Famille>(familleApiUrl + "/update", data);
  }
}
