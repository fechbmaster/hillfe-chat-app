/**
 * Created by Barni on 07.07.2017.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import * as io from 'socket.io/node_modules/socket.io-client';

@Injectable()
export class ChatService {
    private url = "http://localhost:4500";
    private socket: io;

    constructor() {
      this.socket = io(this.url);
    }

    public sendMessage(message): void {
      this.socket.emit('chat message', message);
      console.log("sended message: " + message);
    }

    public getMessages(): Observable<string> {
      let observable = new Observable(observer => {
        this.socket = io(this.url);
        this.socket.on('chat message', (data) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      });
      return observable;
    }

}
