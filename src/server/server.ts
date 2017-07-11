import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import {SocketEvents} from "../client/app/models/socketEvents";
import {DataHandler} from "./data.handler";
import {Room} from "./room";
import {JoinRoomRequest} from "../client/app/models/joinRoomRequest";
/**
 * Created by Barni on 04.07.2017.
 */

export class Server {
  public static readonly port = 4500;
  private static instance: Server;
  private app: any;
  private server: any;
  private io: any;
  private dataHandler: DataHandler;
  private rooms: Room[];

  private constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server);
    this.dataHandler = new DataHandler;
    this.rooms = this.dataHandler.loadRooms();
  }

  static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  private removeUser(username: string): void {
    let rooms = this.rooms;
    for (let room of rooms) {
      for (let i = 0; i < room.usernames.length; i++) {
        if (room.usernames[i]===username) {
          room.usernames.splice(i, 1);
        }
      }
    }
    this.rooms = rooms;
  }

  private getRoom(room: Room): Room {
    for (let orgroom of this.rooms) {
      if (orgroom.roomname===room.roomname)
        return orgroom;
    }
    return room;
  }

  // General-room can't be deleted! Only users can be synced...
  private addUserToRoom(request: JoinRoomRequest): Room {
    this.removeUser(request.username);
    for (let i = 0;  i < this.rooms.length; i++) {
      if (this.rooms[i].roomname === request.newRoom.roomname) {
        this.rooms[i].usernames.push(request.username);
        console.log(this.rooms);
        return this.rooms[i];
      }
    }
    return null;
  }

  public init() {
    this.app.get('/', function (req, res) {
      res.send("<h1>This is the socket.io server for the HillFe-Chat!</h1>")
    });

    this.io.on('connection', (socket) => {
      console.log("User connected with id: "+ socket.id);

      socket.on('disconnect', () => {
        console.log('Guest-user disconnected');
      });

      // Send only to id when rooms are requested
      socket.on(SocketEvents.GETROOMS, () => {
        this.io.to(socket.id).emit(SocketEvents.GETROOMS, this.rooms);
      });

      // Send to room when join to room occurs
      socket.on(SocketEvents.JOINROOM, (msg) => {
        let request: JoinRoomRequest = msg;
        let room: Room =  this.addUserToRoom(request);
        if (room) {
          // make "db" save
          this.dataHandler.saveRooms(this.rooms);
          this.io.to(socket.id).emit(SocketEvents.JOINROOM, room);
          socket.join(request.newRoom.roomname);
          // Emmit for old room
          this.io.to(request.oldRoom.roomname).emit(SocketEvents.ROOMCHANGED, this.getRoom(request.oldRoom));
          // Emmit for new room
          this.io.to(request.newRoom.roomname).emit(SocketEvents.ROOMCHANGED, this.getRoom(request.newRoom));
          // Send to room
          socket.on(SocketEvents.MESSAGE, (msg) => {
            console.log('Server emitted: ' + JSON.stringify(msg));
            this.io.to(request.newRoom.roomname).emit(SocketEvents.MESSAGE, msg);
          });
          socket.on('disconnect', () => {
            console.log('Registered-user disconnected');
            // Emmit for new room
            this.io.to(request.newRoom.roomname).emit(SocketEvents.ROOMCHANGED, this.getRoom(request.newRoom));
          });
        }
      });

      // Send only to id when login occurs
      socket.on(SocketEvents.LOGIN, (msg) => {
        console.log("Server emitted login for user: " + JSON.stringify(msg));
        this.io.to(socket.id).emit(SocketEvents.LOGIN, this.dataHandler.checkForUser(msg));
      });
    });

    this.server.listen(Server.port, function () {
      console.log("Created server, listening on port " + Server.port);
    });
  }
}
