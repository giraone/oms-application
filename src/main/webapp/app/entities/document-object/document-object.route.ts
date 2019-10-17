import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from './document-object.service';
import { DocumentObjectComponent } from './document-object.component';
import { DocumentObjectDetailComponent } from './document-object-detail.component';
import { DocumentObjectUpdateComponent } from './document-object-update.component';
import { DocumentObjectDeletePopupComponent } from './document-object-delete-dialog.component';
import { IDocumentObject } from 'app/shared/model/document-object.model';

@Injectable({ providedIn: 'root' })
export class DocumentObjectResolve implements Resolve<IDocumentObject> {
  constructor(private service: DocumentObjectService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDocumentObject> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<DocumentObject>) => response.ok),
        map((documentObject: HttpResponse<DocumentObject>) => documentObject.body)
      );
    }
    return of(new DocumentObject());
  }
}

export const documentObjectRoute: Routes = [
  {
    path: '',
    component: DocumentObjectComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'omsApp.documentObject.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DocumentObjectDetailComponent,
    resolve: {
      documentObject: DocumentObjectResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'omsApp.documentObject.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DocumentObjectUpdateComponent,
    resolve: {
      documentObject: DocumentObjectResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'omsApp.documentObject.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DocumentObjectUpdateComponent,
    resolve: {
      documentObject: DocumentObjectResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'omsApp.documentObject.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const documentObjectPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: DocumentObjectDeletePopupComponent,
    resolve: {
      documentObject: DocumentObjectResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'omsApp.documentObject.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
