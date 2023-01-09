import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DocumentObjectComponent } from '../list/document-object.component';
import { DocumentObjectDetailComponent } from '../detail/document-object-detail.component';
import { DocumentObjectUpdateComponent } from '../update/document-object-update.component';
import { DocumentObjectRoutingResolveService } from './document-object-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const documentObjectRoute: Routes = [
  {
    path: '',
    component: DocumentObjectComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocumentObjectDetailComponent,
    resolve: {
      documentObject: DocumentObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocumentObjectUpdateComponent,
    resolve: {
      documentObject: DocumentObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocumentObjectUpdateComponent,
    resolve: {
      documentObject: DocumentObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(documentObjectRoute)],
  exports: [RouterModule],
})
export class DocumentObjectRoutingModule {}
