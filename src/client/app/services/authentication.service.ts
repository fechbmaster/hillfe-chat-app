///<reference path="../../../../node_modules/rxjs/add/operator/map.d.ts"/>
/**
 * Created by Barni on 07.07.2017.
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import {Router} from "@angular/router";
import {User} from "../models/user";
import {SocketService} from "./socket.service";
import {SocketEvents} from "../models/socketEvents";

@Injectable()
export class AuthenticationService {

  constructor(private router: Router, private socketService: SocketService) {
  }

  public login(user: User): Promise<any> {
    // Emit login to server
    this.socketService.emit(SocketEvents.LOGIN, user);
    // Wait for response
    return new Promise((resolve, reject) => {
      this.socketService.getResponse(SocketEvents.LOGIN)
        .subscribe((data) => {
            resolve(data);
          },
          err => {
            console.error("Failed to get a resonse from server at login. \n Error: " + err.message);
            reject(err);
          }
        )});
  }

  public getCurrentUser(): User {
    this.checkCredentials();
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  public logout(): void {
    // clear ser from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(["login-page"]).then();
  }

  public checkCredentials(): void{
    if (localStorage.getItem("currentUser") === null){
      this.router.navigate(["login-page"]).then();
    }
  }
}
