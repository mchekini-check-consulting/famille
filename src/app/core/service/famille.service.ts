import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Famille } from "../model/famille";
import { infosApiUrl } from "../common";

@Injectable({
  providedIn: "root",
})
export class InfosService {
  constructor(private http: HttpClient) {}

  getInfosFamille(): Observable<Famille> {
    return this.http.get<Famille>(infosApiUrl + "/get");
  }

  putInfosFamille(data: Famille) {
    return this.http.put<Famille>(infosApiUrl + "/update", data);
  }
}
