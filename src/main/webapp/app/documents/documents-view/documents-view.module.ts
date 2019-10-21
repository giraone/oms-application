import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OmsSharedModule } from 'app/shared/shared.module';
import { DocumentsViewerComponent } from './documents-viewer.component';
import { DocumentsUploadComponent } from './documents-upload.component';
import { DocumentUpdateComponent } from './document-update.component';
import { DocumentToolsComponent } from './document-tools.component';

import { documentsViewerRoute } from './documents-view.route';

const ENTITY_STATES = [...documentsViewerRoute];

@NgModule({
  imports: [OmsSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DocumentsViewerComponent,
    DocumentsUploadComponent,
    DocumentUpdateComponent,
    DocumentToolsComponent
  ]
})
export class OmsDocumentsViewModule {}
