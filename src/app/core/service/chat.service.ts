import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Messages } from "../model/messages";
import { Nounou } from "../model/nounou";
import { chatApiUrl } from "../common";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatFamille(): Observable<Messages[]> {
    return this.http.get<Messages[]>(chatApiUrl + "/get");
  }

  sendChatFamille(data: Messages) {
    return this.http.post<Messages>(chatApiUrl + "/send", data);
  }

  getListNounous(): Observable<Nounou[]> {
    return this.http.get<Nounou[]>(
      "api/v1/famille/search/nounou?nom=&prenom=&ville="
    );
  }
}
