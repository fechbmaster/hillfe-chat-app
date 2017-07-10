import {User} from "./user";
import {Room} from "./room";
/**
 * Created by Barni on 10.07.2017.
 */
export class JoinRoomRequest {
  constructor(public username: string, public room: Room) {}
}
