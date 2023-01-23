import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Message } from '../types/message';

export const WS_ENDPOINT = 'ws://localhost:8081';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private socket$: WebSocketSubject<Message> | any;

  private messagesSubject = new Subject<Message>();

  public messages$ = this.messagesSubject.asObservable();

  constructor() { }

  public connect(): void {
    this.socket$ = this.getNewWebSocket();
    this.socket$.subscribe(
      (msg:any) => {
        console.log('Recieved message of type:' + msg.type);
        this.messagesSubject.next(msg);
      }
    )
  }

  sendMessage(msg: Message): void{
    console.log('Sending Message:' + msg.type);
    this.socket$.next(msg);
  }

  private getNewWebSocket() {
    return webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log('DataService: connection OK');
        }
      },
      closeObserver: {
        next: () => {
          console.log('DataService: connection closed');
          this.connect();
        }
      }
    });
  }
}
