import {
  Component,
  OnInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { ChatService } from "../../core/service/chat.service";
import { Messages } from "../../core/model/messages";
import { DatePipe } from "@angular/common";

import { ToastrService } from "ngx-toastr";

import { ActivatedRoute } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";

import { interval } from "rxjs/internal/observable/interval";
import { Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

export interface Item {
  nom: string;
  prenom: string;
  adresse: string;
  mail: string;
  telephone: string;
  selected: boolean;
}

export interface Conversation {
  content: string;
  timeMessage: string;
  type: string;
  email: string;
}

export interface DataToSend {
  content: string;
  emailSource: string;
  emailDest: string;
  timeMessage: null;
}

@Component({
  selector: "app-messagerie",
  templateUrl: "./messagerie.component.html",
  styleUrls: ["./messagerie.component.scss"],
})
export class MessagerieComponent implements OnInit, AfterViewChecked {
  @ViewChild("chat") private myScrollContainer: ElementRef;

  constructor(
    private chatService: ChatService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private _Activatedroute: ActivatedRoute,
    private oauthService: OAuthService
  ) {
    this.screenHeight = window.innerHeight;
  }

  public screenHeight: any;
  public listConversations: Conversation[] = [];
  public items: Item[] = [];
  private selectedItem: string = "";
  private dataToSend: DataToSend[] = [];
  private id: string = "";
  private currentEmail: string = "";

  // Insérer des données temporaires
  private nounous: Item[] = [];
  public conversations: Messages[] = [];

  timeInterval: Subscription;
  status: any;

  getCurrentUser(): void {
    this.currentEmail = this.oauthService.getIdentityClaims()["email"];
  }

  ngOnInit() {
    this.timeInterval = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.chatService.getChatFamille())
      )
      .subscribe(
        (resp) => ((this.conversations = [...resp]), this.poolService()),
        (err) => console.log("HTTP Error", err)
      );

    this.getCurrentUser();
    this.chatService.getListNounous().subscribe((resp) => {
      resp.map((r) => {
        this.nounous.push({ ...r, selected: false });
      });
      this.chatService.getChatFamille().subscribe((resp) => {
        this.conversations = [...resp];
        this.initService();
      });
    });
  }

  poolService(): void {
    // Trier les conversations
    this.conversations.sort((a, b) => {
      return Number(a.timeMessage) - Number(b.timeMessage);
    });

    this.getListConversation(this.selectedItem, "");
  }

  initService(): void {
    // récupèrer la valeur de l'id envoyé par une recherche
    this._Activatedroute.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get("id");
    });

    // Trier les conversations
    this.conversations.sort((a, b) => {
      return Number(a.timeMessage) - Number(b.timeMessage);
    });

    // Récuperer la liste des nounous
    const data = [...this.conversations];
    data.reverse().map((chat) => {
      this.items.push(
        ...this.nounous.filter(
          (e) => e.mail == chat.emailDest || e.mail == chat.emailSource
        )
      );
    });

    // Obtenir des valeurs uniques des nounous
    this.items = this.items.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.mail === value.mail)
    );

    this.items.map((e) => {
      this.dataToSend.push({
        content: "",
        emailSource: this.currentEmail,
        emailDest: e.mail,
        timeMessage: null,
      });
    });

    if (this.id != null) {
      this.getListConversation(this.id, "search");
    } else if (this.items.length > 0) {
      this.getListConversation(this.items[0].mail, "");
    }
  }

  ngAfterViewChecked(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getListConversation(selectedItem: string, origin: string) {
    this.selectedItem = selectedItem;
    this.listConversations = [];
    this.conversations.map((chat) => {
      if (chat.emailSource == selectedItem || chat.emailDest == selectedItem) {
        this.listConversations.push({
          content: chat.content,
          timeMessage: this.datePipe.transform(
            chat.timeMessage,
            "yyyy-MM-dd HH:mm"
          ),
          type: chat.emailSource == this.currentEmail ? "output" : "input",
          email:
            chat.emailSource == this.currentEmail
              ? chat.emailDest
              : chat.emailSource,
        });
      }
    });

    // Vérifier si l'item n'a aucune conversation
    if (origin == "search" && this.listConversations.length === 0) {
      // Créer une conversation vide et ajouter l'item à la liste
      this.items.unshift(...this.nounous.filter((e) => e.mail == selectedItem));
      this.dataToSend.push({
        content: "",
        emailSource: this.currentEmail,
        emailDest: selectedItem,
        timeMessage: null,
      });
    }

    // Mettre a jour l'item selectionné
    this.items.map((e, i) =>
      e.mail == selectedItem
        ? (this.items[i].selected = true)
        : (this.items[i].selected = false)
    );
  }

  getBgSelected(item: Item): string {
    if (item.selected) {
      return "beige";
    } else {
      return "#fff";
    }
  }

  getContent(): string {
    var cont: string = "";
    this.dataToSend.map((e) => {
      if (e.emailDest == this.selectedItem) cont = e.content;
    });
    return cont;
  }

  handleContent(e: any): void {
    this.dataToSend.map((d, i) => {
      if (d.emailDest == this.selectedItem)
        return (this.dataToSend[i].content = e.target.value);
    });
  }

  sendMessage(e: any): void {
    e.preventDefault();
    const data = this.dataToSend.filter((d) => {
      return d.emailDest == this.selectedItem;
    })[0];
    if (data.content.length == 0) {
      this.toastr.error("Veuillez saisir un message avant de continuer !");
      return;
    }
    if (data.content.length >= 100) {
      this.toastr.error(
        "Veuillez saisir un message de 100 caractères maximum !"
      );
      return;
    }
    this.chatService.sendChatFamille(data).subscribe(() => {
      this.conversations.push({
        content: data.content,
        timeMessage: new Date(),
        emailSource: data.emailSource,
        emailDest: data.emailDest,
      });
      this.getListConversation(data.emailDest, "");
      this.dataToSend.map((d, i) => {
        if (d.emailDest == this.selectedItem)
          return (this.dataToSend[i].content = "");
      });
    });
  }
}
