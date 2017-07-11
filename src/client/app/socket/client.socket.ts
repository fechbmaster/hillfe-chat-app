/**
 * Created by Barni on 09.07.2017.
 */
import * as io from 'socket.io-client';

export class ClientSocket {
  public readonly url = "http://localhost:4500";
  private static instance: ClientSocket;
  public static socket;

  private constructor () {
    ClientSocket.socket = io(this.url);
  }

  static getInstance(): ClientSocket {
    if (!ClientSocket.instance) {
      ClientSocket.instance = new ClientSocket();
    }
    return ClientSocket.instance;
  }
}
