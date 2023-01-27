import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { WebcamModule } from 'ngx-webcam';
import { FormsModule } from '@angular/forms';
import { VideoComponent } from './video/video.component';
import { VideostrComponent } from './videostr/videostr.component';
import { TextChatComponent } from './videostr/text-chat/text-chat.component';


@NgModule({
  declarations: [
    HomeComponent,
    VideoComponent,
    VideostrComponent,
    TextChatComponent
  ],
  imports: [

  CommonModule,
    HomeRoutingModule,
    SharedModule,
    WebcamModule,
    FormsModule,
  ]
})
export class HomeModule { }
