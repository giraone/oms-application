import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';

import { DocumentsService } from './documents.service';
import { DocumentEventsService } from './document-events.service';
import { IDocumentObject } from 'app/entities/model/document-object.model';
import { DocumentPolicy } from 'app/entities/model/enumerations/document-policy.model';
import { EventManager } from 'app/core/util/event-manager.service';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-documents-viewer',
  templateUrl: './documents-viewer.component.html',
})
export class DocumentsViewerComponent implements OnInit, OnDestroy {
  currentAccount: any;
  documentObjects: IDocumentObject[];
  error: any;
  success: any;
  eventSubscriber: Subscription | undefined;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  constructor(
    protected documentsService: DocumentsService,
    protected documentEventsService: DocumentEventsService,
    protected parseLinks: ParseLinks,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: EventManager
  ) {
    console.log('DocumentsViewerComponent # # # # CTOR');
    this.documentObjects = [];
    this.itemsPerPage = 100;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = true;
      this.predicate = data.pagingParams.predicate;
    });
  }

  loadAll(): void {
    this.documentsService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: ['id,desc'],
      })
      .subscribe((res: HttpResponse<IDocumentObject[]>) => res.body && this.useResponse(res.body, res.headers));
  }

  display(document: IDocumentObject): void {
    window.open(document.objectUrl, '_new');
  }

  publishDocument(document: IDocumentObject): void {
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

  unPublishDocument(document: IDocumentObject): void {
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

  lockDocument(document: IDocumentObject): void {
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

  rename(document: IDocumentObject): void {
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

  delete(document: IDocumentObject): void {
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

  trackId(index: number, item: IDocumentObject): number | undefined {
    return item.id;
  }

  protected useResponse(data: IDocumentObject[], headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    this.links = linkHeader ? this.parseLinks.parse(linkHeader) : undefined;
    const totalItemsHeader = headers.get('X-Total-Count');
    this.totalItems = totalItemsHeader ? parseInt(totalItemsHeader, 10) : 0;
    this.documentObjects = data;
  }
}
