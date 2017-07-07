/**
 * Created by Barni on 07.07.2017.
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {ChatService} from "../services/chat.service";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";

@Component( {
  selector: "chat-component",
  templateUrl: "./chat.component.html",
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {

  public messages : string[] = [];
  private connection: Subscription;
  public message: string;

  constructor(private chatService: ChatService, private authService: AuthenticationService) {}

  private sendMessage(): void {
    // Send only when message is there
    if (this.message) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  private logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authService.checkCredentials();
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
      console.log(this.messages);
    })
  }

  ngOnDestroy(): void {
    this.connection.unsubscribe();
  }

}
