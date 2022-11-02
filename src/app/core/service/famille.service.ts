import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Famille} from '../model/famille';

@Injectable({
    providedIn: 'root'
})

export class FamilleService {

    constructor(private http: HttpClient) {
    }

    getFamille(email: string): Observable<Famille> {
        return this.http.get<Famille>('famille-api/api/v1/famille/getById/' + email);
    }

    putFamille(data: Famille) {
        return this.http.put<Famille>('famille-api/api/v1/famille/update', data);
    }
}
