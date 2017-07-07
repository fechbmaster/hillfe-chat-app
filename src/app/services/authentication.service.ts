/**
 * Created by Barni on 07.07.2017.
 */
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

export class User {
  constructor(
    public username: string,
    public password: string) { }
}

var users = [
  new User('admin','admin'),
  new User('user','user')
];

@Injectable()
export class AuthenticationService {
  public token: string;

  constructor(private router: Router) {
  }

  public login(user:User): boolean {
    var authenticatedUser = users.find(u => u.username === user.username);
    if (authenticatedUser && authenticatedUser.password === user.password){
      localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
      this.router.navigate(["/chat"]);
      return true;
    }
    return false;
  }

  public logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(["/login-page"]);
  }

  public checkCredentials(): void{
    console.log(localStorage.getItem("currentUser"));
    if (localStorage.getItem("currentUser") === null){
      this.router.navigate(["/login-page"]);
      console.log("User unbekannt");
    }
  }
}
