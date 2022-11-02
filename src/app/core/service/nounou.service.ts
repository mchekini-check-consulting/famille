import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NounouModel} from "../model/nounou.model";

@Injectable({
    providedIn: 'root'
})
export class NounouService {

    constructor(private readonly http: HttpClient) {
    }

    getNounouInformations(): Observable<NounouModel> {
        return this.http.get<NounouModel>("/api/v1/nounou/getById/me.chekini@gmail.com")
    }

}
