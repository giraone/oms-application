import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OmsSharedModule } from 'app/shared/shared.module';
import { DocumentObjectComponent } from './document-object.component';
import { DocumentObjectDetailComponent } from './document-object-detail.component';
import { DocumentObjectUpdateComponent } from './document-object-update.component';
import { DocumentObjectDeleteDialogComponent } from './document-object-delete-dialog.component';
import { documentObjectRoute } from './document-object.route';

@NgModule({
  imports: [OmsSharedModule, RouterModule.forChild(documentObjectRoute)],
  declarations: [
    DocumentObjectComponent,
    DocumentObjectDetailComponent,
    DocumentObjectUpdateComponent,
    DocumentObjectDeleteDialogComponent,
  ],
  entryComponents: [DocumentObjectDeleteDialogComponent],
})
export class OmsDocumentObjectModule {}
