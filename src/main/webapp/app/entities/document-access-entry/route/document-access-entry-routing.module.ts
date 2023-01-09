import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DocumentAccessEntryComponent } from '../list/document-access-entry.component';
import { DocumentAccessEntryDetailComponent } from '../detail/document-access-entry-detail.component';
import { DocumentAccessEntryUpdateComponent } from '../update/document-access-entry-update.component';
import { DocumentAccessEntryRoutingResolveService } from './document-access-entry-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const documentAccessEntryRoute: Routes = [
  {
    path: '',
    component: DocumentAccessEntryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocumentAccessEntryDetailComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocumentAccessEntryUpdateComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocumentAccessEntryUpdateComponent,
    resolve: {
      documentAccessEntry: DocumentAccessEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(documentAccessEntryRoute)],
  exports: [RouterModule],
})
export class DocumentAccessEntryRoutingModule {}
