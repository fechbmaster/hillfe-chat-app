import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import {SocketEvents} from "../app/models/socketEvents";
import {DataHandler} from "./data.handler";
import {Room} from "./room";
import {JoinRoomRequest} from "../app/models/joinRoomRequest";
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
    for (let room of this.rooms) {
      room.usernames.splice(room.usernames.indexOf(username), 1);
    }
  }

  // General-room can't be deleted! Only users can be synced...
  private addUserToRoom(request: JoinRoomRequest): boolean {
    this.removeUser(request.username);
    for (let i = 0;  i < this.rooms.length; i++) {
      if (this.rooms[i].roomname === request.room.roomname) {
        this.rooms[i].usernames.push(request.username);
        return true;
      }
    }
    return false;
  }

  public init() {
    this.app.get('/', function (req, res) {
      res.send("<h1>This is the socket.io server for the HillFe-Chat!</h1>")
    });

    this.io.on('connection', (socket) => {
      console.log("User connected with id: "+ socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });

      // Send only to id when rooms are requested
      socket.on(SocketEvents.GETROOMS, () => {
        this.io.to(socket.id).emit(SocketEvents.GETROOMS, this.rooms);
      });

      // Send to room when join to room occurs
      socket.on(SocketEvents.JOINROOM, (msg) => {
        let request: JoinRoomRequest = msg;
        let added: boolean =  this.addUserToRoom(request);
        if (added) {
          // make "db" save
          this.dataHandler.saveRooms(this.rooms);
          this.io.to(socket.id).emit(SocketEvents.JOINROOM, this.rooms);
          socket.join(request.room.roomname);
          this.io.to(request.room.roomname).emit(SocketEvents.ROOMCHANGED, this.rooms);
        }
      });

      // Send only to id when login occurs
      socket.on(SocketEvents.LOGIN, (msg) => {
        console.log("Server emitted login for user: " + JSON.stringify(msg));
        this.io.to(socket.id).emit(SocketEvents.LOGIN, this.dataHandler.checkForUser(msg));
      });

      // Send to all
      socket.on(SocketEvents.MESSAGE, (msg) => {
        console.log('Server emitted: ' + JSON.stringify(msg));
        this.io.emit(SocketEvents.MESSAGE, msg);
      });
    });

    this.server.listen(Server.port, function () {
      console.log("Created server, listening on port " + Server.port);
    });
  }
}
