import {User} from "../app/models/user";
import * as fs from "fs";
/**
 * Created by Barni on 09.07.2017.
 */


export class DataHandler {
  constructor() {}

  public saveUserToJSON(user: User): boolean {
    return false;
  }

  public getAllUsers(): User[] {
    return JSON.parse(require('./user.json'));
  }

  public getUser(user: User) {

  }
}
