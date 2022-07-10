import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription, ReplaySubject, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import Stomp, { Client, Subscription as StompSubscription, ConnectionHeaders, Message } from 'webstomp-client';

import { AuthServerProvider } from '../../core/auth/auth-jwt.service';
import { S3Event } from './s3-event.model';

@Injectable({ providedIn: 'root' })
export class DocumentEventsService {
  private stompClient: Client | null = null;
  private connectionSubject: ReplaySubject<void> = new ReplaySubject(1);
  private connectionSubscription: Subscription | null = null;
  private stompSubscription: StompSubscription | null = null;
  private stompSubscription2: StompSubscription | null = null;
  private listenerSubject: Subject<S3Event> = new Subject();

  constructor(private authServerProvider: AuthServerProvider, private location: Location) {}

  connect(connectCallback?: () => void, errorCallback?: (error: any) => void): void {
    console.log(`# # # # DocumentEventsService connect connected=${this.stompClient?.connected}`);

    if (this.stompClient?.connected) {
      connectCallback?.();
      return;
    }

    // building absolute path so that websocket doesn't fail when deploying with a context path
    let url = '/websocket/document-events';
    url = this.location.prepareExternalUrl(url);
    const authToken = this.authServerProvider.getToken();
    if (authToken) {
      url += '?access_token=' + authToken;
    }
    const socket: WebSocket = new SockJS(url);
    this.stompClient = Stomp.over(socket, { protocols: ['v12.stomp'] });
    // TODO (hs): Google for Options
    // this.stompClient.heartbeat.outgoing = 10000; // send outgoing heart beat every 10 seconds (default)
    // this.stompClient.heartbeat.incoming = 10000; // request incoming heart beat every 10 seconds (default)
    // this.stompClient.reconnectDelay = 200; // wait in milliseconds before attempting auto reconnect
    const headers: ConnectionHeaders = {};
    this.stompClient.connect(
      headers,
      () => {
        this.connectionSubject.next();
        console.log('# # # # DocumentEventsService CONNECTED OK');
        connectCallback?.();
      },
      error => {
        console.log('# # # # DocumentEventsService CONNECT FAILED ' + JSON.stringify(error));
        errorCallback?.(error);
      }
    );
  }

  disconnect(): void {
    console.log('# # # # DocumentEventsService disconnect');

    this.unsubscribe();

    this.connectionSubject = new ReplaySubject(1);

    if (this.stompClient) {
      if (this.stompClient.connected) {
        this.stompClient.disconnect();
      }
      this.stompClient = null;
    }
  }

  receive(): Subject<S3Event> {
    return this.listenerSubject;
  }

  subscribe(): void {
    console.log('# # # # DocumentEventsService subscribe');

    this.connect();

    if (this.connectionSubscription) {
      return;
    }

    this.connectionSubscription = this.connectionSubject.subscribe(() => {
      if (this.stompClient) {
        this.stompSubscription = this.stompClient.subscribe('/topic/s3-event', (data: Message) => {
          console.log('# # # # DocumentEventsService RECEIVED ' + data.body);
          const response = JSON.parse(data.body);
          console.log(`# # # # DocumentEventsService PASS_TO_OBSERVER ${response.event}`);
          this.listenerSubject.next(response);
        });
      }
    });
    console.log(`# # # # DocumentEventsService subscribed connectionSubscription=${this.connectionSubscription}`);
  }

  unsubscribe(): void {
    console.log('# # # # DocumentEventsService unsubscribe');
    if (this.stompSubscription) {
      this.stompSubscription.unsubscribe();
      this.stompSubscription = null;
    }

    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
      this.connectionSubscription = null;
    }
  }

  send(event: S3Event): void {
    this.connect();

    if (this.stompClient?.connected) {
      this.stompClient.send(
        '/topic/s3-queue', // destination
        JSON.stringify(event), // body
        {} // header
      );
    } else {
      console.log('DocumentEventsService.send ERROR: no stompClient or not connected!');
    }
  }
}
