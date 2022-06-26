import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { DocumentsViewerComponent } from './documents-viewer.component';
import { DocumentsUploadComponent } from './documents-upload.component';
import { DocumentUpdateComponent } from './document-update.component';
import { DocumentToolsComponent } from './document-tools.component';

import { DocumentEventsService } from './document-events.service';

import { documentsViewerRoute } from './documents-view.route';

const ENTITY_STATES = [...documentsViewerRoute];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DocumentsViewerComponent,
    DocumentsUploadComponent,
    DocumentUpdateComponent,
    DocumentToolsComponent
  ],
  providers: [DocumentEventsService],
})
export class OmsDocumentsViewModule {}
