import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { IDocumentObject } from 'app/shared/model/document-object.model';
import { AccountService } from 'app/core/auth/account.service';

import { DocumentsService } from './documents.service';

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
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
  }

  ngOnDestroy() {
  }

  trackId(index: number, item: IDocumentObject) {
    return item.id;
  }

  protected useResponse(data: IDocumentObject[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.documentObjects = data;
  }
}
