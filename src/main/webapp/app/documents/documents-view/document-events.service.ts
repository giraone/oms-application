import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Location } from '@angular/common';

import { AuthServerProvider } from '../../core/auth/auth-jwt.service';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';

@Injectable({ providedIn: 'root' })
export class DocumentEventsService {
  stompClient = null;
  subscriber = null;
  connection: Promise<any>;
  connectedPromise: any;
  listener: Observable<any>;
  listenerObserver: Observer<any>;

  constructor(
    private authServerProvider: AuthServerProvider,
    private location: Location
  ) {
    this.connection = this.createConnection();
    this.listener = this.createListener();
  }

  connectAndSubscribe() {
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
    console.log('# # # # DocumentEventsService.connect VERSIONS = ' + JSON.stringify(Stomp.VERSIONS));
    this.stompClient = Stomp.over(socket, { protocols: ['v10.stomp', 'v11.stomp', 'v12.stomp'], binary: false });
    this.stompClient.heartbeat.outgoing = 10000; // send outgoing heart beat every 10 seconds (default)
    this.stompClient.heartbeat.incoming = 10000; // request incoming heart beat every 10 seconds (default)
    this.stompClient.reconnectDelay = 200; // wait in milliseconds before attempting auto reconnect
    const headers = {};

    this.stompClient.connect(headers, () => {
      console.log('# # # # DocumentEventsService CONNECTED');
      this.subscribe();
    },
    (error) => {
      console.log('# # # # DocumentEventsService CONNECT FAILED ' + JSON.stringify(error));
    });
  }

  unsubcribeAndDisconnect() {
    if (this.stompClient !== null) {
      this.unsubscribe();
      this.stompClient.disconnect();
      console.log('# # # # DocumentEventsService DISCONNECTED');
      this.stompClient = null;
    }
  }

  receive() {
    return this.listener;
  }

  send(payloadText: string) {

    if (this.stompClient !== null && this.stompClient.connected) {
      this.stompClient.send(
        '/topic/s3-queue', // destination
        JSON.stringify({ payload: payloadText }), // body
        {} // header
      );
    } else {
      console.log('DocumentEventsService.send ERROR: no stompClient!');
    }
  }

  private subscribe() {
    this.subscriber = this.stompClient.subscribe('/topic/s3-event', data => {
      console.log('# # # # DocumentEventsService RECEIVED ' + data.body);
      const response = JSON.parse(data.body);
      if (response.payload.startsWith("connect")) {
        console.log('# # # # DocumentEventsService RECEIVED CONNECT');
      } else if (this.listenerObserver) {
        console.log('# # # # DocumentEventsService PASS_TO_OBSERVER ' + response.payload);
        this.listenerObserver.next(response.payload);
      }
    });
  }

  private unsubscribe() {
    if (this.subscriber !== null) {
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
    return new Promise((resolve, reject) => (this.connectedPromise = resolve));
  }
}
