import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import {SocketEvents} from "../app/models/socketEvents";
/**
 * Created by Barni on 04.07.2017.
 */

export class Server {
  public static readonly port = 4500;
  private static instance: Server;
  private app: any;
  private server: any;
  private io: any;

  private constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server);
  }

  static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public init() {
    this.app.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);

      // Pass to next layer of middleware
      next();
    });

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
        this.io.to(socket.id).emit(SocketEvents.LOGIN, true);
      });
      // Send to all
      socket.on(SocketEvents.MESSAGE, (msg) => {
        console.log('Server emitted: ' + msg);
        this.io.emit(SocketEvents.MESSAGE, msg);
      });
    });

    this.server.listen(Server.port, function () {
      console.log("Created server, listening on port " + Server.port);
    });
  }
}
