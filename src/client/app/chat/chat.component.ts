/**
 * Created by Barni on 07.07.2017.
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {SocketService} from "../services/socket.service";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";
import {SocketEvents} from "../models/socketEvents";
import {Message} from "../models/message";

@Component( {
  selector: "chat-component",
  templateUrl: "./chat.component.html",
  styleUrls: ['./chat.component.css'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit, OnDestroy {

  public messages: Message[] = [];
  private connection: Subscription;
  public message: string;
  public placeholderUrl = "../../assets/Person-placeholder.jpg";
  public timeStamp: string;

  constructor(private chatService: SocketService, private authService: AuthenticationService) {}

  private sendMessage(): void {
    // Send only when message is typed
    if (this.message) {
      let msg: Message = new Message(this.message, this.authService.getCurrentUser().username);
      this.chatService.emit(SocketEvents.MESSAGE, msg);
      this.message = '';
    }
  }

  private logout(): void {
    this.authService.logout();
  }

  private static getTimeStamp(): string {
    let d = new Date();
    return d.getHours()+":"+d.getMinutes();
  }

  ngOnInit(): void {
    this.authService.checkCredentials();
    this.connection = this.chatService.getResponse(SocketEvents.MESSAGE).subscribe(message => {
      this.timeStamp = ChatComponent.getTimeStamp();
      let msg: Message = message;
      if (msg.username === this.authService.getCurrentUser().username) {
        msg.own = true;
      }
      this.messages.push(msg);
    })
  }

  ngOnDestroy(): void {
    //todo: unsubscribe all others too
    this.connection.unsubscribe();
  }

}
