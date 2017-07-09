import {User} from "../app/models/user";
import * as fs from "fs";
/**
 * Created by Barni on 09.07.2017.
 */


export class DataHandler {
  constructor() {}

  public getAllUsers(): User[] {
    return require('./user.json');
  }

  public checkForUser(user: User): boolean {
    let userList: User[] = this.getAllUsers();
    for (var i = 0; i < userList.length; i++) {
      if (userList[i].username === user.username && userList[i].password === user.password)
        return true;
    }
    return false;
  }
}
