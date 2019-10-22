import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { IDocumentObject } from 'app/shared/model/document-object.model';
import { DocumentPolicy } from 'app/shared/model/enumerations/document-policy.model';
import { AccountService } from 'app/core/auth/account.service';

import { DocumentsService } from './documents.service';
import { DocumentEventsService } from './document-events.service';

@Component({
  selector: 'jhi-documents-viewer',
  templateUrl: './documents-viewer.component.html'
})
export class DocumentsViewerComponent implements OnInit, OnDestroy {
  currentAccount: any;
  documentObjects: IDocumentObject[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
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
    protected parseLinks: JhiParseLinks,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {
    // eslint-disable-next-line no-console
    console.log('CTOR DocumentsViewerComponent');
    this.itemsPerPage = 100;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = true;
      this.predicate = data.pagingParams.predicate;
    });
  }

  loadAll() {
    this.documentsService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: ['id,desc']
      })
      .subscribe((res: HttpResponse<IDocumentObject[]>) => this.useResponse(res.body, res.headers));
  }

  display(document: IDocumentObject) {
    window.open(document.objectUrl, '_new');
  }

  publishDocument(document: IDocumentObject) {
    this.documentsService
    .update({
      id: document.id,
      name: document.name,
      path: document.path,
      documentPolicy: DocumentPolicy.PUBLIC
    }).subscribe(() => { this.loadAll(); });
  }

  unPublishDocument(document: IDocumentObject) {
    this.documentsService
    .update({
      id: document.id,
      name: document.name,
      path: document.path,
      documentPolicy: DocumentPolicy.PRIVATE
    }).subscribe(() => { this.loadAll(); });
  }

  lockDocument(document: IDocumentObject) {
    this.documentsService
    .update({
      id: document.id,
      name: document.name,
      path: document.path,
      documentPolicy: DocumentPolicy.LOCKED
    }).subscribe(() => { this.loadAll(); });
  }

  rename(document: IDocumentObject) {
    const promptText = 'New name of document:';
    const newName = window.prompt(promptText, document.name);
    if (!newName) return;
    this.documentsService
      .update({
        id: document.id,
        name: newName,
        path: document.path, // TODO: use new model
      }).subscribe(() => { this.loadAll(); });
  }

  delete(document: IDocumentObject) {
    this.documentsService.delete(document.id)
      .subscribe(() => { this.loadAll(); }
    );
  }

  ngOnInit() {
    // eslint-disable-next-line no-console
    console.log('ngOnInit DocumentsViewerComponent');

    this.loadAll();

    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });

    this.documentEventsService.connect();
    this.documentEventsService.subscribe();
    this.documentEventsService.receive().subscribe(s3Event => {
      // eslint-disable-next-line no-console
      console.log('DocumentsViewerComponent # # # # receive s3Event = ' + JSON.stringify(s3Event));
      alert(JSON.stringify(s3Event));
      this.loadAll();
    });
  }

  ngOnDestroy() {
    this.documentEventsService.unsubscribe();
    this.documentEventsService.disconnect();
  }

  trackId(index: number, item: IDocumentObject) {
    return item.id;
  }

  protected useResponse(data: IDocumentObject[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.documentObjects = data;
  }

  protected handleServerPush(data: IDocumentObject[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.documentObjects = data;
  }
}
