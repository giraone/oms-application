import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from '../../entities/document-object/document-object.service';
import { IDocumentObject } from 'app/shared/model/document-object.model';
import { DocumentsViewerComponent } from './documents-viewer.component';
import { DocumentsUploadComponent } from './documents-upload.component';

@Injectable({ providedIn: 'root' })
export class DocumentsViewerResolve implements Resolve<IDocumentObject> {
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

export const documentsViewerRoute: Routes = [
  {
    path: 'documents-view',
    component: DocumentsViewerComponent,
    // TODO
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'documents.titles.documents'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'documents-upload',
    component: DocumentsUploadComponent,
    resolve: {
      documentObject: DocumentsViewerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'documents.titles.upload'
    },
    canActivate: [UserRouteAccessService]
  },
];

