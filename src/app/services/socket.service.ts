/**
 * Created by Barni on 07.07.2017.
 */
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import * as io from 'socket.io/node_modules/socket.io-client';
import {SocketEvents} from "../models/socketEvents";

@Injectable()
export class SocketService {
    private url = "http://localhost:4500";
    private socket: io;

    constructor() {
      this.socket = io(this.url);
    }

    // No need to make this a promise
    public emit(event: SocketEvents, content: any): void {
      const promise = this.socket.emit(event, content);
      console.log("Emited event '%s' with content '%s'.", event, JSON.stringify(content));
    }

    public getResponse(event: SocketEvents): Observable<any> {
        let observable = new Observable(observer => {
        this.socket.on(event, (data) => {
          observer.next(data);
        },
        err => console.error(err.messsage)
        );
      });
      return observable;
    }

}
