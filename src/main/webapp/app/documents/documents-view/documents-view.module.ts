import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { DocumentsViewerComponent } from './documents-viewer.component';
import { DocumentsUploadComponent } from './documents-upload.component';
import { DocumentUpdateComponent } from './document-update.component';
import { DocumentToolsComponent } from './document-tools.component';
import { DocumentEventsService } from './document-events.service';
import { DocumentsViewRoutingModule } from './documents-view-routing.module';

@NgModule({
  imports: [SharedModule, DocumentsViewRoutingModule],
  declarations: [DocumentsViewerComponent, DocumentsUploadComponent, DocumentUpdateComponent, DocumentToolsComponent],
  providers: [DocumentEventsService],
})
export class DocumentsViewModule {}
