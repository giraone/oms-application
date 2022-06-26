import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DocumentObjectService } from '../../entities/document-object/document-object.service';
import { DocumentsViewerComponent } from './documents-viewer.component';
import { DocumentsUploadComponent } from './documents-upload.component';
import { DocumentUpdateComponent } from './document-update.component';
import { DocumentToolsComponent } from './document-tools.component';
import { DocumentObject, IDocumentObject } from 'app/entities/model/document-object.model';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class DocumentsViewerResolve implements Resolve<IDocumentObject> {
  constructor(private service: DocumentObjectService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentObject> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<DocumentObject>) => response.ok),
        map((documentObject: HttpResponse<DocumentObject>) => (documentObject.body ? documentObject.body : new DocumentObject()))
      );
    }
    return of(new DocumentObject());
  }
}

export const documentsViewerRoute: Routes = [
  {
    path: 'documents-view',
    component: DocumentsViewerComponent,
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'documents.titles.documents',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'documents-upload',
    component: DocumentsUploadComponent,
    resolve: {
      documentObject: DocumentsViewerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'documents.titles.upload',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'tools',
    component: DocumentToolsComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'documents.titles.tools',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'document/:id/update',
    component: DocumentUpdateComponent,
    resolve: {
      documentObject: DocumentsViewerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'documents.titles.upload',
    },
    canActivate: [UserRouteAccessService],
  },
];
