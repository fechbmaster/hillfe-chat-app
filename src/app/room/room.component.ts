/**
 * Created by Barni on 10.07.2017.
 */
import {Component, OnInit} from "@angular/core";
import {Room} from "../models/room";
import {RoomService} from "../services/room.service";
import {AuthenticationService} from "../services/authentication.service";
import {SocketService} from "../services/socket.service";
import {DataHandler} from "../../server/data.handler";
import {SocketEvents} from "../models/socketEvents";

@Component( {
  selector: "room-component",
  templateUrl: "./room.component.html",
  styleUrls: ['./room.component.css'],
  providers: [RoomService, AuthenticationService, SocketService, DataHandler]
})
export class RoomComponent implements OnInit {
  public currentRoom: Room = new Room("loading...");
  public rooms: Room[] = [];
  public placeholderUrl = "../../assets/Person-placeholder.jpg";

  constructor(private roomService: RoomService, private authService: AuthenticationService, private socketService: SocketService){}

  public changeRoom(room: Room) {
    if (room === this.currentRoom)
      return;
    this.roomService.joinRoom(this.authService.getCurrentUser(), room).then((res) => {
      if (res) {
        console.log("Changed room to: "+ room.roomname);
        this.currentRoom = room;
        this.rooms = res;
      }
      else
        console.log("Can't change user to new room!")
      }
    )
  }

  ngOnInit(): void {
    this.roomService.getRooms().then( (res) => {
      this.rooms = res;
      this.changeRoom(this.rooms[0]);
    });
    this.socketService.getResponse(SocketEvents.ROOMCHANGED).subscribe(res => {
      this.rooms = res;
    })
  }

}
