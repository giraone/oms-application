import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DocumentsViewerComponent } from './documents-viewer.component';
import { DocumentsUploadComponent } from './documents-upload.component';
import { DocumentUpdateComponent } from './document-update.component';
import { DocumentToolsComponent } from './document-tools.component';
import { DocumentsViewRoutingResolveService } from './documents-view-routing-resolve.service';

const documentsViewerRoute: Routes = [
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
      documentObject: DocumentsViewRoutingResolveService,
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
      documentObject: DocumentsViewRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'documents.titles.upload',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(documentsViewerRoute)],
  exports: [RouterModule],
})
export class DocumentsViewRoutingModule {}
