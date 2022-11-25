import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Options } from "../model/options";
import { appApiUrl } from "../common";

@Injectable({
  providedIn: "root",
})
export class OptionsService {
  constructor(private http: HttpClient) {}

  getOptionsFamille(): Observable<Options> {
    return this.http.get<Options>(appApiUrl + "/get");
  }

  updateOptionsFamille(data: Options) {
    return this.http.put<Options>(appApiUrl + "/update", data);
  }
}
