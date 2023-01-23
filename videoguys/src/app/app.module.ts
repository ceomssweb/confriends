import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WebcamModule } from 'ngx-webcam';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCl-SMdI56C-uAUiPgpQBVcn_lV0bmHzh8",
  authDomain: "video-chat-d1610.firebaseapp.com",
  projectId: "video-chat-d1610",
  storageBucket: "video-chat-d1610.appspot.com",
  messagingSenderId: "62538030890",
  appId: "1:62538030890:web:aa69f0e0d7c64e7e1a8853",
  measurementId: "G-F8KYHRH1L3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebcamModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
