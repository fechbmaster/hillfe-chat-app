import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ChatComponent} from "./chat/chat.component";
import {SocketService} from "./services/socket.service";
import {FormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";
import {AuthenticationService} from "./services/authentication.service";
import {RouterModule, Routes} from "@angular/router";
import {HttpModule} from "@angular/http";
import {RoomComponent} from "./room/room.component";
import {RoomService} from "./services/room.service";

const appRoutes: Routes = [
  {path: "", redirectTo: "chat", pathMatch: "full" },
  {path: "login-page", component: LoginComponent},
  {path: "chat", component: ChatComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    RoomComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {useHash: true, enableTracing: false}, // <--- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [SocketService, AuthenticationService, RoomService],
  bootstrap: [AppComponent]
})
export class AppModule { }
