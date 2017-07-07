/**
 * Created by Barni on 07.07.2017.
 */
import {Component} from "@angular/core";
import {AuthenticationService, User} from "../services/authentication.service";

@Component ({
  selector: "login-component",
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css'],
  providers: [AuthenticationService]
})
export class LoginComponent {
  private user = new User('','');
  private errorMsg: string = '';

  constructor(private loginService: AuthenticationService) { }

  private login() {
    if(!this.loginService.login(this.user)){
      this.errorMsg = 'Failed to login';
    }
  }

}


