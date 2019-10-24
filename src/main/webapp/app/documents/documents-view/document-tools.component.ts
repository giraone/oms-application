import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { DocumentsService } from './documents.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { DocumentEventsService } from './document-events.service';

@Component({
  selector: 'jhi-document-tools',
  templateUrl: './document-tools.component.html'
})
export class DocumentToolsComponent implements OnInit {

  users: IUser[];

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected documentsService: DocumentsService,
    protected documentEventsService: DocumentEventsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {

    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => {
        this.users = res
        }, (res: HttpErrorResponse) => {
        this.jhiAlertService.error(res.message, null, null);
      });
  }

  recreateThumbnails() {
    this.documentsService.maintenanceThumbnails()
    .subscribe((data) => {
      console.log('DocumentToolsComponent.recreateThumbnails OK');
    }, (error) => {
      this.jhiAlertService.error("ERROR in recreateThumbnails: " + error, null, null);
    });
  }

  stompConnect() {
    console.log('DocumentToolsComponent.stompConnect');
    this.documentEventsService.connectAndSubscribe();
  }

  stompDisconnect() {
    console.log('DocumentToolsComponent.stompDisconnect');
    this.documentEventsService.unsubcribeAndDisconnect();
  }

  stompSend(payloadText: string) {
    console.log('DocumentToolsComponent.stompSend');
    this.documentEventsService.send(payloadText);
  }

  stompListenToReceive() {
    console.log('DocumentToolsComponent.stompListenToReceive');
    this.documentEventsService.receive().subscribe(s3Event => {
      console.log('DocumentToolsComponent # # # # received s3Event = ' + JSON.stringify(s3Event));
      alert(JSON.stringify(s3Event));
    });
  }
}
