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

export interface Item {
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  selected: boolean;
}

export interface Conversation {
  content: string;
  time: string;
  type: string;
  email: string;
}

export interface DataToSend {
  content: string;
  emailSource: string;
  emailDest: string;
  time: null;
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
    private _Activatedroute: ActivatedRoute
  ) {
    this.screenHeight = window.innerHeight;
  }

  public screenHeight: any;
  public listConversations: Conversation[] = [];
  public items: Item[] = [];
  private selectedItem: string = "";
  private dataToSend: DataToSend[] = [];
  private id: string = "";

  // Insérer des données temporaires
  private nounous: Item[] = [
    {
      prenom: "Mahdi",
      nom: "Chekini",
      email: "me.chekini@gmail.com",
      adresse: "16 rue de la voute 75012 paris",
      selected: false,
    },
    {
      prenom: "Essaid",
      nom: "Brahiti",
      email: "essaid.brahiti@gmail.com",
      adresse: "10 rue médéric 94120 fontenay",
      selected: false,
    },
    {
      prenom: "Djedjiga",
      nom: "Kesri",
      email: "djedjiga.kesri@gmail.com",
      adresse: "5 rue saint gobain 93300 Aubervilliers",
      selected: false,
    },
    {
      prenom: "Tahar",
      nom: "Makour",
      email: "tahar2968@gmail.com",
      adresse: "24 rue maréchal leclerc 69800 lyon",
      selected: false,
    },
  ];
  public conversations: Messages[] = [
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "me.chekini@gmail.com",
      content: "Bonjour, comment allez vous ?",
      time: new Date("December 1, 2022, 12:01:35"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "me.chekini@gmail.com",
      content: "Ca va merci",
      time: new Date("December 1, 2022, 12:04:09"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "me.chekini@gmail.com",
      content: "J'aimerais savoir si vous seriez libre pour discuter",
      time: new Date("December 1, 2022, 12:04:23"),
    },
    {
      emailSource: "me.chekini@gmail.com",
      emailDest: "m82.ramdani@gmail.com",
      content: "Bonjour, ça va merci et vous ?",
      time: new Date("December 1, 2022, 12:01:55"),
    },
    {
      emailSource: "me.chekini@gmail.com",
      emailDest: "m82.ramdani@gmail.com",
      content:
        "Oui y a pas de soucis. Vous pouvez me contacter sur mon téléphone.",
      time: new Date("December 1, 2022, 12:04:47"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "essaid.brahiti@gmail.com",
      content: "Bonjour",
      time: new Date("December 2, 2022, 15:33:16"),
    },
    {
      emailSource: "essaid.brahiti@gmail.com",
      emailDest: "m82.ramdani@gmail.com",
      content: "Bonjour",
      time: new Date("December 2, 2022, 15:34:09"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "essaid.brahiti@gmail.com",
      content: "Je vous contacte à propos d'une place pour ma fille",
      time: new Date("December 2, 2022, 15:34:23"),
    },
    {
      emailSource: "essaid.brahiti@gmail.com",
      emailDest: "m82.ramdani@gmail.com",
      content: "D'accord, vous pouvez me contacter sur mon numéro",
      time: new Date("December 2, 2022, 15:44:09"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "djedjiga.kesri@gmail.com",
      content: "Bonjour Madame, j'espère que tu vas bien",
      time: new Date("December 1, 2022, 13:07:35"),
    },
    {
      emailSource: "djedjiga.kesri@gmail.com",
      emailDest: "m82.ramdani@gmail.com",
      content: "Bonjour ça va merci et vous",
      time: new Date("December 2, 2022, 13:09:09"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "djedjiga.kesri@gmail.com",
      content:
        "Ca va merci. Je vous contacte à propos d'une place pour ma fille",
      time: new Date("December 2, 2022, 13:14:23"),
    },
    {
      emailSource: "djedjiga.kesri@gmail.com",
      emailDest: "m82.ramdani@gmail.com",
      content: "Désolé, je n'ai plus de disponibilités actuellement",
      time: new Date("December 2, 2022, 13:21:09"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "djedjiga.kesri@gmail.com",
      content: "D'accord merci. Je vais rappeler plus tard.",
      time: new Date("December 2, 2022, 13:26:23"),
    },
    {
      emailSource: "djedjiga.kesri@gmail.com",
      emailDest: "m82.ramdani@gmail.com",
      content: "Y a pas de soucis",
      time: new Date("December 2, 2022, 13:29:09"),
    },
    {
      emailSource: "djedjiga.kesri@gmail.com",
      emailDest: "m82.ramdani@gmail.com",
      content: "Veuillez me rappeler la semaine prochaine",
      time: new Date("December 2, 2022, 13:32:09"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "djedjiga.kesri@gmail.com",
      content: "Parfait merci",
      time: new Date("December 2, 2022, 13:34:09"),
    },
    {
      emailSource: "m82.ramdani@gmail.com",
      emailDest: "tahar2968@gmail.com",
      content: "Bonjour",
      time: new Date("December 1, 2022, 10:11:23"),
    },
  ];

  ngOnInit() {
    /*this.chatService.getChatFamille().subscribe((resp) => {
      this.items = [...resp];
    });*/

    // récupèrer la valeur de l'id envoyé par une recherche
    this._Activatedroute.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get("id");
    });

    // Trier les conversations
    this.conversations.sort((a, b) => {
      return Number(a.time) - Number(b.time);
    });

    // Récuperer la liste des nounous
    const data = [...this.conversations];
    data.reverse().map((chat) => {
      this.items.push(
        ...this.nounous.filter(
          (e) => e.email == chat.emailDest || e.email == chat.emailSource
        )
      );
    });

    // Obtenir des valeurs uniques des nounous
    this.items = this.items.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.email === value.email)
    );

    this.items.map((e) => {
      this.dataToSend.push({
        content: "",
        emailSource: "m82.ramdani@gmail.com",
        emailDest: e.email,
        time: null,
      });
    });

    if (this.id != null) {
      this.getListConversation(this.id);
    } else if (this.items.length > 0) {
      this.getListConversation(this.items[0].email);
    }
  }

  ngAfterViewChecked(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getListConversation(selectedItem: string) {
    this.selectedItem = selectedItem;
    this.listConversations = [];
    this.conversations.map((chat) => {
      if (chat.emailSource == selectedItem || chat.emailDest == selectedItem) {
        this.listConversations.push({
          content: chat.content,
          time: this.datePipe.transform(chat.time, "yyyy-MM-dd HH:mm"),
          type:
            chat.emailSource == "m82.ramdani@gmail.com" ? "output" : "input",
          email:
            chat.emailSource == "m82.ramdani@gmail.com"
              ? chat.emailDest
              : chat.emailSource,
        });
      }
    });
    // Mettre a jour l'item selectionné
    this.items.map((e, i) =>
      e.email == selectedItem
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
        time: new Date(),
        emailSource: data.emailSource,
        emailDest: data.emailDest,
      });
      this.getListConversation(data.emailDest);
      this.dataToSend.map((d, i) => {
        if (d.emailDest == this.selectedItem)
          return (this.dataToSend[i].content = "");
      });
    });
  }
}
