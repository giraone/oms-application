import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OmsSharedModule } from 'app/shared/shared.module';
import { DocumentsViewerComponent } from './documents-viewer.component';
import { DocumentsUploadComponent } from './documents-upload.component';
import { documentsViewerRoute } from './documents-view.route';

const ENTITY_STATES = [...documentsViewerRoute];

@NgModule({
  imports: [OmsSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DocumentsViewerComponent,
    DocumentsUploadComponent
  ]
})
export class OmsDocumentsViewModule {}
