/**
 * Created by Barni on 07.07.2017.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {SocketEvents} from "../models/socketEvents";
import {ClientSocket} from "../socket/client.socket";

@Injectable()
export class SocketService {

    constructor() {
      ClientSocket.getInstance();
    }

    // No need to make this a promise
    public emit(event: SocketEvents, content?: any): void {
      ClientSocket.socket.emit(event, content);
      console.log("Emited event '%s' with content '%s'.", event, JSON.stringify(content));
    }

    public getResponse(event: SocketEvents): Observable<any> {
        let observable = new Observable(observer => {
        ClientSocket.socket.on(event, (data) => {
          observer.next(data);
        },
        err => console.error(err.messsage)
        );
      });
      return observable;
    }

}
