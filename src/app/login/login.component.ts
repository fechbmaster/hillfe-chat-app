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
    let loginSucess: boolean = false;
    let promise = new Promise ((resolve) => {
      console.log("prom:" + this.authService.login(this.user));
    }).then((res) => {
      console.log(loginSucess);
        if (loginSucess) {
          // Don't do anything if navigation ist not complete
          this.router.navigate(["/chat"]).then();
        }
        else {
          this.errorMsg = "Login nicht erfolgreich. Bitte überprüfen Sie Ihren Benutzernamen und Passwort!";
        }
      }
    ).catch((err) => {
      this.errorMsg = "Es trat ein Fehler beim Anmelden auf. Bitte kontaktieren Sie den Administrator! \n Fehler: " + err.message;
    });
  }

}


