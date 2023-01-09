import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocumentAccessEntry } from '../document-access-entry.model';
import { DocumentAccessEntryService } from '../service/document-access-entry.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './document-access-entry-delete-dialog.component.html',
})
export class DocumentAccessEntryDeleteDialogComponent {
  documentAccessEntry?: IDocumentAccessEntry;

  constructor(protected documentAccessEntryService: DocumentAccessEntryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.documentAccessEntryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
