import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentAccessEntryComponent } from './list/document-access-entry.component';
import { DocumentAccessEntryDetailComponent } from './detail/document-access-entry-detail.component';
import { DocumentAccessEntryUpdateComponent } from './update/document-access-entry-update.component';
import { DocumentAccessEntryDeleteDialogComponent } from './delete/document-access-entry-delete-dialog.component';
import { DocumentAccessEntryRoutingModule } from './route/document-access-entry-routing.module';

@NgModule({
  imports: [SharedModule, DocumentAccessEntryRoutingModule],
  declarations: [
    DocumentAccessEntryComponent,
    DocumentAccessEntryDetailComponent,
    DocumentAccessEntryUpdateComponent,
    DocumentAccessEntryDeleteDialogComponent,
  ],
})
export class DocumentAccessEntryModule {}
