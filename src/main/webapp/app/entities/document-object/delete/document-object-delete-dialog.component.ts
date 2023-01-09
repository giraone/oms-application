import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocumentObject } from '../document-object.model';
import { DocumentObjectService } from '../service/document-object.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './document-object-delete-dialog.component.html',
})
export class DocumentObjectDeleteDialogComponent {
  documentObject?: IDocumentObject;

  constructor(protected documentObjectService: DocumentObjectService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.documentObjectService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
