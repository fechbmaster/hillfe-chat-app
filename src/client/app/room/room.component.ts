/**
 * Created by Barni on 10.07.2017.
 */
import {Component, OnInit} from "@angular/core";
import {Room} from "../models/room";
import {RoomService} from "../services/room.service";
import {AuthenticationService} from "../services/authentication.service";
import {SocketService} from "../services/socket.service";
import {SocketEvents} from "../models/socketEvents";

@Component( {
  selector: "room-component",
  templateUrl: "./room.component.html",
  styleUrls: ['./room.component.css'],
  providers: [RoomService, AuthenticationService]
})
export class RoomComponent implements OnInit {
  public currentRoom: Room = new Room("loading...");
  public rooms: Room[] = [];
  public users: string[] = [];
  public placeholderUrl = "../../assets/Person-placeholder.jpg";

  constructor(private roomService: RoomService, private authService: AuthenticationService, private socketService: SocketService){}

  public changeRoom(room: Room) {
    this.roomService.joinRoom(this.authService.getCurrentUser(), this.currentRoom, room).then((res) => {
      if (res) {
        console.log("Changed room to: "+ room.roomname);
        this.currentRoom = res;
        this.users = this.currentRoom.usernames;
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
      this.users = res.usernames;
    })
  }

}
