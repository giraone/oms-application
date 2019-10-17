import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DocumentAccessEntry } from 'app/shared/model/document-access-entry.model';
import { DocumentAccessEntryService } from './document-access-entry.service';
import { DocumentAccessEntryComponent } from './document-access-entry.component';
import { DocumentAccessEntryDetailComponent } from './document-access-entry-detail.component';
import { DocumentAccessEntryUpdateComponent } from './document-access-entry-update.component';
import { DocumentAccessEntryDeletePopupComponent } from './document-access-entry-delete-dialog.component';
import { IDocumentAccessEntry } from 'app/shared/model/document-access-entry.model';

@Injectable({ providedIn: 'root' })
export class DocumentAccessEntryResolve implements Resolve<IDocumentAccessEntry> {
  constructor(private service: DocumentAccessEntryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDocumentAccessEntry> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<DocumentAccessEntry>) => response.ok),
        map((documentAccessEntry: HttpResponse<DocumentAccessEntry>) => documentAccessEntry.body)
      );
    }
    return of(new DocumentAccessEntry());
  }
}

export const documentAccessEntryRoute: Routes = [
  {
    path: '',
    component: DocumentAccessEntryComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'omsApp.documentAccessEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DocumentAccessEntryDetailComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'omsApp.documentAccessEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DocumentAccessEntryUpdateComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'omsApp.documentAccessEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DocumentAccessEntryUpdateComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'omsApp.documentAccessEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const documentAccessEntryPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: DocumentAccessEntryDeletePopupComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'omsApp.documentAccessEntry.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
