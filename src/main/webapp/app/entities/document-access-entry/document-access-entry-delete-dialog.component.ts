import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDocumentAccessEntry } from 'app/shared/model/document-access-entry.model';
import { DocumentAccessEntryService } from './document-access-entry.service';

@Component({
  templateUrl: './document-access-entry-delete-dialog.component.html',
})
export class DocumentAccessEntryDeleteDialogComponent {
  documentAccessEntry?: IDocumentAccessEntry;

  constructor(
    protected documentAccessEntryService: DocumentAccessEntryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.documentAccessEntryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('documentAccessEntryListModification');
      this.activeModal.close();
    });
  }
}
