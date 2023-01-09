import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentObjectComponent } from './list/document-object.component';
import { DocumentObjectDetailComponent } from './detail/document-object-detail.component';
import { DocumentObjectUpdateComponent } from './update/document-object-update.component';
import { DocumentObjectDeleteDialogComponent } from './delete/document-object-delete-dialog.component';
import { DocumentObjectRoutingModule } from './route/document-object-routing.module';

@NgModule({
  imports: [SharedModule, DocumentObjectRoutingModule],
  declarations: [
    DocumentObjectComponent,
    DocumentObjectDetailComponent,
    DocumentObjectUpdateComponent,
    DocumentObjectDeleteDialogComponent,
  ],
})
export class DocumentObjectModule {}
