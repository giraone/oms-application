import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from './document-object.service';

@Component({
  templateUrl: './document-object-delete-dialog.component.html',
})
export class DocumentObjectDeleteDialogComponent {
  documentObject?: IDocumentObject;

  constructor(
    protected documentObjectService: DocumentObjectService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.documentObjectService.delete(id).subscribe(() => {
      this.eventManager.broadcast('documentObjectListModification');
      this.activeModal.close();
    });
  }
}
