import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import {SocketEvents} from "../app/models/socketEvents";
import {DataHandler} from "./data.handler";
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

  private constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server);
    this.dataHandler = new DataHandler;
  }

  static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
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
      // Send only to id when login occurs
      socket.on(SocketEvents.LOGIN, (msg) => {
        console.log("Server emitted login for user: " + JSON.stringify(msg));
        this.io.to(socket.id).emit(SocketEvents.LOGIN, this.dataHandler.checkForUser(msg));
      });
      // Send to all
      socket.on(SocketEvents.MESSAGE, (msg) => {
        console.log('Server emitted: ' + msg);
        this.io.emit(SocketEvents.MESSAGE, JSON.stringify(msg));
      });
    });

    this.server.listen(Server.port, function () {
      console.log("Created server, listening on port " + Server.port);
    });
  }
}
