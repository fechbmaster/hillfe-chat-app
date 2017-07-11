/**
 * Created by Barni on 07.07.2017.
 */
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {SocketService} from "../services/socket.service";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";
import {SocketEvents} from "../models/socketEvents";
import {Message} from "../models/message";
import {Router} from "@angular/router";
@Component( {
  selector: "chat-component",
  templateUrl: "./chat.component.html",
  styleUrls: ['./chat.component.css'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chat_area') private chat_area: ElementRef;
  public messages: Message[] = [];
  private connection: Subscription;
  public message: string;
  public placeholderUrl = "../../assets/Person-placeholder.jpg";
  public timeStamp: string;

  constructor(private chatService: SocketService, private authService: AuthenticationService, private router: Router) {}

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

  private scrollToBottom(): void {
    try {
      this.chat_area.nativeElement.scrollTop = this.chat_area.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngOnInit(): void {
    if(!this.authService.checkCredentials()) {
      this.router.navigate(["login-page"]).then();
    }
    this.connection = this.chatService.getResponse(SocketEvents.MESSAGE).subscribe(message => {
      this.timeStamp = ChatComponent.getTimeStamp();
      let msg: Message = message;
      if (msg.username === this.authService.getCurrentUser().username) {
        msg.own = true;
      }
      this.messages.push(msg);
      this.scrollToBottom();
    })
  }

  ngOnDestroy(): void {
    if(this.connection)
      this.connection.unsubscribe();
  }

}
