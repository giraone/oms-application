import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OmsSharedModule } from 'app/shared/shared.module';
import { DocumentObjectComponent } from './document-object.component';
import { DocumentObjectDetailComponent } from './document-object-detail.component';
import { DocumentObjectUpdateComponent } from './document-object-update.component';
import { DocumentObjectDeletePopupComponent, DocumentObjectDeleteDialogComponent } from './document-object-delete-dialog.component';
import { documentObjectRoute, documentObjectPopupRoute } from './document-object.route';

const ENTITY_STATES = [...documentObjectRoute, ...documentObjectPopupRoute];

@NgModule({
  imports: [OmsSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DocumentObjectComponent,
    DocumentObjectDetailComponent,
    DocumentObjectUpdateComponent,
    DocumentObjectDeleteDialogComponent,
    DocumentObjectDeletePopupComponent
  ],
  entryComponents: [DocumentObjectDeleteDialogComponent]
})
export class OmsDocumentObjectModule {}
