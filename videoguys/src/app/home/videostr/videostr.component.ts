import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataService } from './service/data.service';
import { Message } from './types/message';


export const ENV_RTCPeerConfiguration = environment.RTCPeerConfiguration;

const mediaConstraints = {
  audio: true,
  video: {width: 500, height: 500}
};

const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

@Component({
  selector: 'vg-videostr',
  templateUrl: './videostr.component.html',
  styleUrls: ['./videostr.component.scss']
})
export class VideostrComponent implements OnInit, AfterViewInit {

  private localStream: MediaStream | any;
  inCall = false;
  localVideoActive = false;

  @ViewChild('videoLocal') localVideo:any;
  @ViewChild('videoRemote') localRemote:any;

  private peerConnection: RTCPeerConnection | any;

  constructor(private dataservice: DataService){}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.addIncomingMessageHandler();
    this.requestMediaDevices();
  }

  private async requestMediaDevices(): Promise<void> {
     this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
     this.localVideo.nativeElement.srcObject = this.localStream;

    // try {
    //   this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    //   // pause all tracks
    //   this.pauseLocalStream();
    // } catch (e: any) {
    //   //console.error(e);
    //   alert(`getUserMedia() error: ${e.name}`);
    // }
  }

  pauseLocalStream(): void{
    console.log('pause local stream');
    this.localStream.getTracks().forEach(track => {
      track.enabled = false;
    });
    this.localVideo.nativeElement.srcObject = undefined;
    this.localVideoActive = false;
  }

  startLocalStream(): void{
    console.log('starting local stream');
    this.localStream.getTracks().forEach(track => {
      track.enabled = true;
    });
    this.localVideo.nativeElement.srcObject = this.localStream;
    this.localVideoActive = true;
  }

  async call(): Promise<void> {
    this.createPeerConnection();
    this.localStream.getTracks().forEach(
      track => this.peerConnection.addTrack(track, this.localStream));

    try {
      const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer(offerOptions);
      await this.peerConnection.setLocalDescription(offer);
      this.inCall = true;
      this.dataservice.sendMessage({type: 'offer', data: offer});
    } catch(err: any) {
      this.handleGetUserMediaError(err);
    }
  }

  private createPeerConnection(): void{
    this.peerConnection = new RTCPeerConnection(ENV_RTCPeerConfiguration);
    this.peerConnection.onicecandidate = this.handleIceCandidateEvent;
    this.peerConnection.onicegatheringstatechange = this.handleIceConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange = this.handleSignalingStateEvent;
    this.peerConnection.ontrack = this.handleTrackEvent;
  }

  private closeVideoCall(): void {
    console.log('Closing call');
    if(this.peerConnection){
      console.log('--> Closing the peer connection');
      this.peerConnection.ontrack = null;
      this.peerConnection.onicecandidate = null;
      this.peerConnection.onicegatheringstatechange = null;
      this.peerConnection.onsignalingstatechange = null;
    }
  // Stop all transceivers on the connection
    // this.peerConnection.getTransceivers().forEach(transceiver => {
    //   transceiver.stop();
    // });

    //this.peerConnection.close();
    this.peerConnection = null;
    this.inCall = false;
  }

  private handleGetUserMediaError(e: Error): void{
    switch (e.name) {
      case 'NotFoundError':
        alert('unable to open your call because no camera and/or mic were found');
        break;
        case 'SecurityError':
        case 'PermissionDeniedError':
          break;
          default:
            console.log(e);
            alert('Error opening your camera' + e.message)
            break;

    };

  }

  private handleIceCandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    console.log(event);
    if(event.candidate){
      this.dataservice.sendMessage({
        type: 'ice-candidate',
        data: event.candidate
      })
    }
  }

  private handleIceConnectionStateChangeEvent = (event: Event) => {
    console.log(event);
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
        case 'failed':
          case 'disconnected':
            this.closeVideoCall();
            break;
    }
  }

  private handleSignalingStateEvent = (event: Event) => {
    console.log(event);
    switch (this.peerConnection.signallingSate) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }

  private handleTrackEvent = (event: RTCTrackEvent) => {
    console.log(event);
    this.localRemote.nativeElement.srcObject = event.streams[0];
  }

  private addIncomingMessageHandler(): void {
    this.dataservice.connect();

    this.dataservice.messages$.subscribe(
      msg => {
        switch(msg.type){
          case 'offer':
            this.handleOfferMessage(msg.data);
            break;
            case 'answer':
              this.handleAnswerMessage(msg.data);
              break;
              case 'hangup':
                this.handleHangupMessage(msg);
                break;
                case 'ice-candidate':
                  this.handleIceCandidateMessage(msg.data);
                  break;
                  default:
                    console.log('unknown message of type' + msg.type);
        }
      },

      error => {console.log(error)}
    );
  }

  private handleOfferMessage(msg: RTCSessionDescriptionInit): void {
    if(!this.peerConnection){
      this.createPeerConnection();
    }
    if(!this.localStream){
      this.startLocalStream();
    }

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg)).then(() => {
      this.localVideo.nativeElement.srcObject = this.localStream;
      this.localStream.getTracks().forEach(
        track => this.peerConnection.addTrack(track, this.localStream)
      );
    }).then(() => {
      return this.peerConnection.createAnswer();
    }).then((answer: RTCSessionDescriptionInit) => {
      return this.peerConnection.setLocalDescription(answer);
    }).then(() => {
      this.dataservice.sendMessage({type: 'answer', data: this.peerConnection.setLocalDescription});
      this.inCall = true;
    }).catch(this.handleGetUserMediaError);
  }

  private handleAnswerMessage(msg: RTCSessionDescriptionInit): void {
    console.log('handle incoming answer');
    this.peerConnection.setRemoteDescription(msg);
  }

  private handleHangupMessage(msg: Message): void {
    this.closeVideoCall();
  }

  private handleIceCandidateMessage(msg: RTCIceCandidate): void {
    const candidate = new RTCIceCandidate(msg);
    this.peerConnection.addIceCandidate(candidate).catch(this.reportError)
  }

  private reportError = (e: Error) => {
    console.log('got Error' + e.name);
    console.log(e);
  }

  hangUp(): void{
    this.dataservice.sendMessage({type: 'hangup', data:''});
    this.closeVideoCall();
  }

}
