import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';

import { IDocumentObjectRead } from './document-read-write.model';
import { DocumentsService } from './documents.service';
import { DocumentEventsService } from './document-events.service';
import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-documents-viewer',
  templateUrl: './documents-viewer.component.html',
})
export class DocumentsViewerComponent implements OnInit, OnDestroy {
  currentAccount: any;
  documentObjects: IDocumentObjectRead[] = [];
  error: any;
  success: any;
  eventSubscriber: Subscription | undefined;
  routeData: any;
  totalItems = 0;
  itemsPerPage = 100;

  constructor(
    protected documentsService: DocumentsService,
    protected documentEventsService: DocumentEventsService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
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
    this.documentEventsService.connectAndSubscribe();
    this.documentEventsService.receive().subscribe(s3Event => {
      console.log('DocumentsViewerComponent # # # # receive s3Event = ' + JSON.stringify(s3Event));
      this.loadAll();
    });
  }

  ngOnDestroy(): void {
    console.log('DocumentsViewerComponent # # # # ON_DESTROY');
    this.documentEventsService.unsubcribeAndDisconnect();
  }

  protected useResponse(data: IDocumentObjectRead[], headers: HttpHeaders): void {
    const totalItemsHeader = headers.get('X-Total-Count');
    this.totalItems = totalItemsHeader ? parseInt(totalItemsHeader, 10) : 0;
    this.documentObjects = data;
  }
}
