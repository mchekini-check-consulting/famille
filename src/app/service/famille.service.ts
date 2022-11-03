import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';//pour fair des requette http ver l'api
import { Famille } from './Famille';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FamilleService {
  private baseUrl = "http://localhost:8080/api/v1/famille/getById/";//déclaration de l'url du notre api

  constructor(private http: HttpClient) { }

    //methode get pour récupérer les données d'une famille 
     getFamille(email: string): Observable<Famille>{//Observable ????
    return this.http.get<Famille>(`${this.baseUrl + email}`);//???
  }

}

