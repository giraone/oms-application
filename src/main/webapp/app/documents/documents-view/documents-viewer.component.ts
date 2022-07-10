import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';

import { IDocumentObjectRead } from './document-read-write.model';
import { DocumentsService } from './documents.service';
import { DocumentEventsService } from './document-events.service';
import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';
import { EventManager } from 'app/core/util/event-manager.service';
import { S3Event } from './s3-event.model';

@Component({
  selector: 'jhi-documents-viewer',
  templateUrl: './documents-viewer.component.html',
})
export class DocumentsViewerComponent implements OnInit, OnDestroy {
  currentAccount: any;
  documentObjects: IDocumentObjectRead[] = [];
  subscription?: Subscription;
  totalItems = 0;
  itemsPerPage = 100;

  constructor(
    protected documentsService: DocumentsService,
    protected documentEventsService: DocumentEventsService,
    protected accountService: AccountService,
    protected eventManager: EventManager
  ) {}

  loadAll(): void {
    this.documentsService
      .query({
        page: 0,
        size: this.itemsPerPage,
        sort: ['id,desc'],
      })
      .subscribe((res: HttpResponse<IDocumentObjectRead[]>) => res.body && this.useResponse(res.body, res.headers));
  }

  display(document: IDocumentObjectRead): void {
    if (!document.objectUrl) {
      return;
    }
    window.open(document.objectUrl, '_new');
  }

  publishDocument(document: IDocumentObjectRead): void {
    this.documentsService
      .update({
        id: document.id,
        name: document.name,
        path: document.path,
        documentPolicy: DocumentPolicy.PUBLIC,
      })
      .subscribe(() => {
        this.loadAll();
      });
  }

  unPublishDocument(document: IDocumentObjectRead): void {
    this.documentsService
      .update({
        id: document.id,
        name: document.name,
        path: document.path,
        documentPolicy: DocumentPolicy.PRIVATE,
      })
      .subscribe(() => {
        this.loadAll();
      });
  }

  lockDocument(document: IDocumentObjectRead): void {
    this.documentsService
      .update({
        id: document.id,
        name: document.name,
        path: document.path,
        documentPolicy: DocumentPolicy.LOCKED,
      })
      .subscribe(() => {
        this.loadAll();
      });
  }

  rename(document: IDocumentObjectRead): void {
    const promptText = 'New name of document:';
    const newName = window.prompt(promptText, document.name);
    if (!newName) {
      return;
    }
    this.documentsService
      .update({
        id: document.id,
        name: newName,
        path: document.path, // TODO: Implement rename path
      })
      .subscribe(() => {
        this.loadAll();
      });
  }

  delete(document: IDocumentObjectRead): void {
    document.id &&
      this.documentsService.delete(document.id).subscribe(() => {
        this.loadAll();
      });
  }

  ngOnInit(): void {
    console.log('DocumentsViewerComponent # # # # ON_INIT');
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });

    if (!this.subscription) {
      this.documentEventsService.connect(() => {
        console.log('DocumentsViewerComponent # # # # connected, now subscribe.');
        this.documentEventsService.subscribe();
        this.subscription = this.documentEventsService.receive().subscribe((s3Event: S3Event) => {
          console.log('DocumentsViewerComponent # # # # receive s3Event = ' + JSON.stringify(s3Event));
          if (s3Event.event === 'reloadThumbnail') {
            this.updateDocument(s3Event.payload);
          }
        });
        console.log(`DocumentsViewerComponent # # # # subscribed ${this.subscription}`);
        setTimeout(() => {
          this.documentEventsService.send(new S3Event('clientReady'));
          console.log('DocumentsViewerComponent # # # # ready sent');
        }, 100);
      });
    } else {
      console.log(`DocumentsViewerComponent # # # # already subscribed ${this.subscription}`);
    }
  }

  ngOnDestroy(): void {
    console.log('DocumentsViewerComponent # # # # ON_DESTROY');
    this.documentEventsService.unsubscribe();
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  protected useResponse(data: IDocumentObjectRead[], headers: HttpHeaders): void {
    const totalItemsHeader = headers.get('X-Total-Count');
    this.totalItems = totalItemsHeader ? parseInt(totalItemsHeader, 10) : 0;
    this.documentObjects = data;
  }

  private updateDocument(document: IDocumentObjectRead): void {
    const i = this.documentObjects.findIndex(o => o.id === document.id);
    if (i !== -1) {
      console.log(`DocumentsViewerComponent # # # # replacing ${document.name}`);
      this.documentsService.convertDateFromServerInPlace(document);
      this.documentObjects[i] = document;
    }
  }
}
