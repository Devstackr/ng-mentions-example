import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainDemoComponent } from './pages/main-demo/main-demo.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { MessageComponent } from './message/message.component';
import { MessageInputComponent } from './message-input/message-input.component';

@NgModule({
  declarations: [
    AppComponent,
    MainDemoComponent,
    UserProfileComponent,
    MessageComponent,
    MessageInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
