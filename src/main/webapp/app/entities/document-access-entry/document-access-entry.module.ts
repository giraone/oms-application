import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OmsSharedModule } from 'app/shared/shared.module';
import { DocumentAccessEntryComponent } from './document-access-entry.component';
import { DocumentAccessEntryDetailComponent } from './document-access-entry-detail.component';
import { DocumentAccessEntryUpdateComponent } from './document-access-entry-update.component';
import { DocumentAccessEntryDeleteDialogComponent } from './document-access-entry-delete-dialog.component';
import { documentAccessEntryRoute } from './document-access-entry.route';

@NgModule({
  imports: [OmsSharedModule, RouterModule.forChild(documentAccessEntryRoute)],
  declarations: [
    DocumentAccessEntryComponent,
    DocumentAccessEntryDetailComponent,
    DocumentAccessEntryUpdateComponent,
    DocumentAccessEntryDeleteDialogComponent,
  ],
  entryComponents: [DocumentAccessEntryDeleteDialogComponent],
})
export class OmsDocumentAccessEntryModule {}
