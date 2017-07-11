/**
 * Created by Barni on 10.07.2017.
 */
import {Injectable} from "@angular/core";
import {Room} from "../models/room";
import {User} from "../models/user";
import {SocketService} from "./socket.service";
import {SocketEvents} from "../models/socketEvents";
import {JoinRoomRequest} from "../models/joinRoomRequest";
@Injectable()
export class RoomService {

  constructor(private socketService : SocketService) {}

  public getRooms(): Promise<any> {
    this.socketService.emit(SocketEvents.GETROOMS);
    // Wait until response came from server
    return new Promise((resolve, reject) => {
      this.socketService.getResponse(SocketEvents.GETROOMS)
        .subscribe((data) => {
            resolve(data);
          },
          err => {
            console.error("Failed to get a resonse from server at getting rooms. \n Error: " + err.message);
            reject(err);
          }
        )});
  }

  public joinRoom(user: User, oldRoom: Room, newRoom: Room): Promise<any> {
    this.socketService.emit(SocketEvents.JOINROOM, new JoinRoomRequest(user.username, oldRoom, newRoom));
    // Wait until response came from server
    return new Promise((resolve, reject) => {
      this.socketService.getResponse(SocketEvents.JOINROOM)
        .subscribe((data) => {
            resolve(data);
          },
          err => {
            console.error("Failed to get a resonse from server at room change. \n Error: " + err.message);
            reject(err);
          }
        )});
  }
}
