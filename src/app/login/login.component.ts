/**
 * Created by Barni on 07.07.2017.
 */
import {Component} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {User} from "../models/user";
import {Router} from "@angular/router";

@Component ({
  selector: "login-component",
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css'],
  providers: [AuthenticationService]
})
export class LoginComponent {
  public user = new User('','');
  public errorMsg: string = '';

  constructor(private authService: AuthenticationService, private router: Router) { }

  private login() {
    this.authService.login(this.user).then((res) => {
        if (res == true) {
          localStorage.setItem('currentUser', JSON.stringify(this.user));
          console.log("User successfully loged in.");
          // Wait for promise fulfillment
          this.router.navigate(["/chat"]).then();
        }
        else {
          this.errorMsg = "User not registered yet!";
        }
      }
    )
  }

}


