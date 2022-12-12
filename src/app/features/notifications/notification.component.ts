import { Component, OnInit } from "@angular/core";
import { WebsocketService } from "../shared/services/websocket.service";
import { NotificationService } from "../shared/services/notification.service";
import { AppNotification } from "../shared/model/app-notification";

const icon = new Map([
  ["info", "assets/bell-info.png"],
  ["warn", "assets/bell-warning.png"],
]);
@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  title = "Web push Notifications!";
  counter: number;

  constructor(
    private notificationService: NotificationService,
    private websocketService: WebsocketService
  ) {
    this.counter = 0;
  }

  ngOnInit() {
    this.connect();
  }
  connect(): void {
    this.websocketService.connect();

    // subscribe receives the value.
    this.notificationService.notificationMessage.subscribe((data) => {
      console.log("receive message", data);
      this.notify(data);
    });
  }

  disconnect(): void {
    this.websocketService.disconnect();
  }

  notify(message: AppNotification): void {
    this.counter++;
    const options = {
      body: message.content,
      icon: icon.get(message.type.toLowerCase()),
    };
  }
}
