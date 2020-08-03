import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Location } from '@angular/common';

import { AuthServerProvider } from '../../core/auth/auth-jwt.service';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';

@Injectable({ providedIn: 'root' })
export class DocumentEventsService {
  stompClient: Stomp.Client|undefined;
  subscriber: Stomp.Subscription|undefined;
  connection: Promise<any>;
  connectedPromise: any;
  listener: Observable<any>;
  listenerObserver: Observer<any>|undefined;

  constructor(
    private authServerProvider: AuthServerProvider,
    private location: Location
  ) {
    this.connection = this.createConnection();
    this.listener = this.createListener();
  }

  connectAndSubscribe(): void {
    if (this.connectedPromise === null) {
      this.connection = this.createConnection();
    }
    // building absolute path so that websocket doesn't fail when deploying with a context path
    let url = '/websocket/s3-event';
    url = this.location.prepareExternalUrl(url);
    const authToken = this.authServerProvider.getToken();
    if (authToken) {
      url += '?access_token=' + authToken;
    }
    const socket = new SockJS(url);
    // tslint:disable-next-line:no-console
    console.log('# # # # DocumentEventsService.connect VERSIONS = ' + JSON.stringify(Stomp.VERSIONS));
    this.stompClient = Stomp.over(socket, { protocols: ['v10.stomp', 'v11.stomp', 'v12.stomp'], binary: false });
    // TODO (hs): Google for Options
    // this.stompClient.heartbeat.outgoing = 10000; // send outgoing heart beat every 10 seconds (default)
    // this.stompClient.heartbeat.incoming = 10000; // request incoming heart beat every 10 seconds (default)
    // this.stompClient.reconnectDelay = 200; // wait in milliseconds before attempting auto reconnect
    const headers = {};

    this.stompClient.connect(headers, () => {
      // tslint:disable-next-line:no-console
      console.log('# # # # DocumentEventsService CONNECTED');
      this.subscribe();
    },
    (error) => {
      // tslint:disable-next-line:no-console
      console.log('# # # # DocumentEventsService CONNECT FAILED ' + JSON.stringify(error));
    });
  }

  unsubcribeAndDisconnect(): void {
    if (this.stompClient) {
      this.unsubscribe();
      this.stompClient.disconnect();
      // tslint:disable-next-line:no-console
      console.log('# # # # DocumentEventsService DISCONNECTED');
      this.stompClient = undefined;
    }
  }

  receive(): Observable<any> {
    return this.listener;
  }

  send(payloadText: string): void {

    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        '/topic/s3-queue', // destination
        JSON.stringify({ payload: payloadText }), // body
        {} // header
      );
    } else {
      // tslint:disable-next-line:no-console
      console.log('DocumentEventsService.send ERROR: no stompClient!');
    }
  }

  private subscribe(): void {
    if (!this.stompClient) {
      return;
    }
    this.subscriber = this.stompClient.subscribe('/topic/s3-event', data => {
      // tslint:disable-next-line:no-console
      console.log('# # # # DocumentEventsService RECEIVED ' + data.body);
      const response = JSON.parse(data.body);
      if (response.payload.startsWith("connect")) {
        // tslint:disable-next-line:no-console
        console.log('# # # # DocumentEventsService RECEIVED CONNECT');
      } else if (this.listenerObserver) {
        // tslint:disable-next-line:no-console
        console.log('# # # # DocumentEventsService PASS_TO_OBSERVER ' + response.payload);
        this.listenerObserver.next(response.payload);
      }
    });
  }

  private unsubscribe(): void {
    if (this.subscriber) {
      // tslint:disable-next-line:no-console
      console.log('# # # # DocumentEventsService UNSUBSCRIBE');
      this.subscriber.unsubscribe();
    }
    this.listener = this.createListener();
  }

  private createListener(): Observable<any> {
    return new Observable(observer => {
      this.listenerObserver = observer;
    });
  }

  private createConnection(): Promise<any> {
    return new Promise((resolve) => (this.connectedPromise = resolve));
  }
}
