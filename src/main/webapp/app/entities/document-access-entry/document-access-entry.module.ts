import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OmsSharedModule } from 'app/shared/shared.module';
import { DocumentAccessEntryComponent } from './document-access-entry.component';
import { DocumentAccessEntryDetailComponent } from './document-access-entry-detail.component';
import { DocumentAccessEntryUpdateComponent } from './document-access-entry-update.component';
import {
  DocumentAccessEntryDeletePopupComponent,
  DocumentAccessEntryDeleteDialogComponent
} from './document-access-entry-delete-dialog.component';
import { documentAccessEntryRoute, documentAccessEntryPopupRoute } from './document-access-entry.route';

const ENTITY_STATES = [...documentAccessEntryRoute, ...documentAccessEntryPopupRoute];

@NgModule({
  imports: [OmsSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DocumentAccessEntryComponent,
    DocumentAccessEntryDetailComponent,
    DocumentAccessEntryUpdateComponent,
    DocumentAccessEntryDeleteDialogComponent,
    DocumentAccessEntryDeletePopupComponent
  ],
  entryComponents: [DocumentAccessEntryDeleteDialogComponent]
})
export class OmsDocumentAccessEntryModule {}
