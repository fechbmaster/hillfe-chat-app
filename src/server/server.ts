import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
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
        this.app.get('/', function(req, res){
          res.send("<h1>This is the socket.io server for the HillFe-Chat!</h1>")
        });

        this.io.on('connection', (socket) => {
            console.log("User connected");
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
            socket.on('chat message', (msg) => {
                console.log('message: ' + msg);
                this.io.emit('chat message', msg);
            });
        });

        this.server.listen(Server.port, function () {
            console.log("Created server, listening on port " + Server.port);
        });
    }
}
