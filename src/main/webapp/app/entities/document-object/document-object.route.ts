import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IDocumentObject, DocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from './document-object.service';
import { DocumentObjectComponent } from './document-object.component';
import { DocumentObjectDetailComponent } from './document-object-detail.component';
import { DocumentObjectUpdateComponent } from './document-object-update.component';

@Injectable({ providedIn: 'root' })
export class DocumentObjectResolve implements Resolve<IDocumentObject> {
  constructor(private service: DocumentObjectService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentObject> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((documentObject: HttpResponse<DocumentObject>) => {
          if (documentObject.body) {
            return of(documentObject.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DocumentObject());
  }
}

export const documentObjectRoute: Routes = [
  {
    path: '',
    component: DocumentObjectComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'omsApp.documentObject.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocumentObjectDetailComponent,
    resolve: {
      documentObject: DocumentObjectResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'omsApp.documentObject.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocumentObjectUpdateComponent,
    resolve: {
      documentObject: DocumentObjectResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'omsApp.documentObject.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocumentObjectUpdateComponent,
    resolve: {
      documentObject: DocumentObjectResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'omsApp.documentObject.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
