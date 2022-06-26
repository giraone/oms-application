import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { DocumentsService } from './documents.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { AlertService } from 'app/core/util/alert.service';
import { DocumentEventsService } from './document-events.service';

@Component({
  selector: 'jhi-document-tools',
  templateUrl: './document-tools.component.html',
})
export class DocumentToolsComponent implements OnInit {
  users: IUser[] | null = null;

  constructor(
    protected alertService: AlertService,
    protected documentsService: DocumentsService,
    protected documentEventsService: DocumentEventsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe(
        (res: IUser[] | null) => {
          this.users = res;
        },
        (res: HttpErrorResponse) => {
          this.alertService.addAlert({
            type: 'warning',
            message: res.message,
          });
        }
      );
  }

  recreateThumbnails(): void {
    this.documentsService.maintenanceThumbnails().subscribe(
      () => {
        console.log('DocumentToolsComponent.recreateThumbnails OK');
      },
      error => {
        this.alertService.addAlert({
          type: 'warning',
          message: `ERROR in recreateThumbnails: ${error}`,
        });
      }
    );
  }

  stompConnect(): void {
    console.log('DocumentToolsComponent.stompConnect');
    this.documentEventsService.connectAndSubscribe();
  }

  stompDisconnect(): void {
    console.log('DocumentToolsComponent.stompDisconnect');
    this.documentEventsService.unsubcribeAndDisconnect();
  }

  stompSend(payloadText: string): void {
    console.log('DocumentToolsComponent.stompSend');
    this.documentEventsService.send(payloadText);
  }

  stompListenToReceive(): void {
    console.log('DocumentToolsComponent.stompListenToReceive');
    this.documentEventsService.receive().subscribe(s3Event => {
      console.log(`DocumentToolsComponent # # # # received s3Event = ${JSON.stringify(s3Event)}`);
      alert(JSON.stringify(s3Event));
    });
  }
}
