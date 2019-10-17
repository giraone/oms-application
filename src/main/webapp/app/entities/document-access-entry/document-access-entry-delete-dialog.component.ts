import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDocumentAccessEntry } from 'app/shared/model/document-access-entry.model';
import { DocumentAccessEntryService } from './document-access-entry.service';

@Component({
  selector: 'jhi-document-access-entry-delete-dialog',
  templateUrl: './document-access-entry-delete-dialog.component.html'
})
export class DocumentAccessEntryDeleteDialogComponent {
  documentAccessEntry: IDocumentAccessEntry;

  constructor(
    protected documentAccessEntryService: DocumentAccessEntryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.documentAccessEntryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'documentAccessEntryListModification',
        content: 'Deleted an documentAccessEntry'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-document-access-entry-delete-popup',
  template: ''
})
export class DocumentAccessEntryDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ documentAccessEntry }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DocumentAccessEntryDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.documentAccessEntry = documentAccessEntry;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/document-access-entry', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/document-access-entry', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
