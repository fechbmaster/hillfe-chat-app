/**
 * Created by Barni on 10.07.2017.
 */
export class Room {
  constructor(public roomname: string, public usernames?: string[]) {}

  public addUser(username: string): boolean {
    if (!this.userIsInRoom(username)) {
      this.usernames.push(username);
      return true;
    }
    return false;
  }

  public removeUser(username: string): boolean {
    if(this.userIsInRoom(username)) {
      this.usernames.splice(this.usernames.indexOf(username), 1);
      return true;
    }
    return false;
  }

  private userIsInRoom(username: string): boolean {
    for (let i = 0; i < this.usernames.length; i++) {
      if (this.usernames[i] === username)
        return true;
    }
    return false;
  }
}
