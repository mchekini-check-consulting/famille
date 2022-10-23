import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Famille } from './Famille';

@Injectable({
  providedIn: 'root'
})

export class FamilleService {

  private baseUrlGetById = "http://localhost:8080/api/v1/famille/getById/";
  private baseUrlPut = "http://localhost:8080/api/v1/famille/update/";

  constructor(private http: HttpClient) { }

  getFamille(email: string): Observable<Famille>{
    return this.http.get<Famille>(`${this.baseUrlGetById + email}`);
  }

  putFamille(data: Famille){
   return this.http.put<Famille>(this.baseUrlPut, data);
  }
}