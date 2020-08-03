import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IDocumentAccessEntry, DocumentAccessEntry } from 'app/shared/model/document-access-entry.model';
import { DocumentAccessEntryService } from './document-access-entry.service';
import { DocumentAccessEntryComponent } from './document-access-entry.component';
import { DocumentAccessEntryDetailComponent } from './document-access-entry-detail.component';
import { DocumentAccessEntryUpdateComponent } from './document-access-entry-update.component';

@Injectable({ providedIn: 'root' })
export class DocumentAccessEntryResolve implements Resolve<IDocumentAccessEntry> {
  constructor(private service: DocumentAccessEntryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentAccessEntry> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((documentAccessEntry: HttpResponse<DocumentAccessEntry>) => {
          if (documentAccessEntry.body) {
            return of(documentAccessEntry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DocumentAccessEntry());
  }
}

export const documentAccessEntryRoute: Routes = [
  {
    path: '',
    component: DocumentAccessEntryComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'omsApp.documentAccessEntry.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocumentAccessEntryDetailComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'omsApp.documentAccessEntry.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocumentAccessEntryUpdateComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'omsApp.documentAccessEntry.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocumentAccessEntryUpdateComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'omsApp.documentAccessEntry.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
