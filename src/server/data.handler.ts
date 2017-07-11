/**
 * Created by Barni on 09.07.2017.
 */
import {User} from "../client/app/models/user";
import * as fs from "fs";
import {Room} from "./room";

export class DataHandler {
  private fs;

  constructor() {
    this.fs = fs;
  }

  private loadUsers(): User[] {
    return require('./user.json');
  }

  public checkForUser(user: User): boolean {
    let userList: User[] = this.loadUsers();
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].username === user.username && userList[i].password === user.password)
        return true;
    }
    return false;
  }

  public loadRooms(): Room[] {
    return require('./rooms.json');
  }

  public saveRooms(rooms: Room[]) {
    fs.writeFileSync('./src/server/rooms.json', JSON.stringify(rooms));
  }

}
