import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';


const mediaConstraints ={
  audio: true,
  video: {width: 500, height: 500}
};
@Component({
  selector: 'vg-videostr',
  templateUrl: './videostr.component.html',
  styleUrls: ['./videostr.component.scss']
})
export class VideostrComponent implements OnInit, AfterViewInit {

  private localStream: MediaStream | any;
  @ViewChild('videoLocal') localVideo:any;
  constructor(){}
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.requestMediaDevices();
  }

  private async requestMediaDevices(): Promise<void> {
    this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  pauseLocalStream(): void{
    this.localStream.getTracks().forEach((track:any) => {
      track.enabled = false;
    });
    this.localStream.nativeElement.srcObject = undefined;
  }

  startLocalStream(): void{
    this.localStream.getTracks().forEach((track:any) => {
      track.enabled = true;
    });
    this.localStream.nativeElement.srcObject = this.localStream;
  }

}
