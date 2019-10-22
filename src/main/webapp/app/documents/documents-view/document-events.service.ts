import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
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
  alreadyConnectedOnce = false;
  private subscription: Subscription;

  constructor(
    private authServerProvider: AuthServerProvider,
    private location: Location
  ) {
    this.connection = this.createConnection();
    this.listener = this.createListener();
  }

  connect() {
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
    this.stompClient = Stomp.over(socket);
    const headers = {};
    // eslint-disable-next-line no-console
    console.log('# # # # DocumentEventsService TRY TO CONNECT');
    this.stompClient.connect(headers, () => {
      // eslint-disable-next-line no-console
      console.log('# # # # DocumentEventsService CONNECTED');
      this.connectedPromise('success');
      this.connectedPromise = null;
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.alreadyConnectedOnce = false;
  }

  receive() {
    return this.listener;
  }

  send(payloadText: string) {
    // eslint-disable-next-line no-console
    console.log('DocumentEventsService ' + this.stompClient);
    if (this.stompClient !== null && this.stompClient.connected) {
      this.stompClient.send(
        '/topic/s3-queue', // destination
        JSON.stringify({ payload: payloadText }), // body
        {} // header
      );
    }
  }

  subscribe() {
    this.connection.then(() => {
      this.subscriber = this.stompClient.subscribe('/topic/s3-event', data => {
        const payload = JSON.parse(data.body);
        // eslint-disable-next-line no-console
        console.log('# # # # DocumentEventsService ' + data.body);
        this.listenerObserver.next(payload);
      });
    });
  }

  unsubscribe() {
    if (this.subscriber !== null) {
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
