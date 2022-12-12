import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Intervention } from "../model/intervention";
import { interventionApiUrl } from "../common";

@Injectable({
  providedIn: "root",
})
export class InterventionService {
  constructor(private http: HttpClient) {}

  cancelIntervention(data: any) {
    return this.http.put<any>(interventionApiUrl + "/cancel", data);
  }

  relancerIntervention(data: any) {
    return this.http.put<any>(interventionApiUrl + "/revive", data);
  }
}
