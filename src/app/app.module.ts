import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ChatComponent} from "./chat/chat.component";
import {ChatService} from "./services/chat.service";
import {FormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";
import {AuthenticationService} from "./services/authentication.service";
import {RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  {path: 'login-page', component: LoginComponent},
  {path: 'chat', component: ChatComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <--- debugging purposes only
    ),
    BrowserModule,
    FormsModule
  ],
  providers: [ChatService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
