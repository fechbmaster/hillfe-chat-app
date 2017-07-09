/**
 * Created by Barni on 07.07.2017.
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {SocketService} from "../services/socket.service";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";
import {SocketEvents} from "../models/socketEvents";

@Component( {
  selector: "chat-component",
  templateUrl: "./chat.component.html",
  styleUrls: ['./chat.component.css'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit, OnDestroy {

  public messages : string[] = [];
  private connection: Subscription;
  public message: string;

  constructor(private chatService: SocketService, private authService: AuthenticationService) {}

  private sendMessage(): void {
    // Send only when message is there
    if (this.message) {
      this.chatService.emit(SocketEvents.MESSAGE, this.message);
      this.message = '';
    }
  }

  private logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authService.checkCredentials();
    this.connection = this.chatService.getResponse(SocketEvents.MESSAGE).subscribe(message => {
      this.messages.push(message);
    })
  }

  ngOnDestroy(): void {
    this.connection.unsubscribe();
  }

}
