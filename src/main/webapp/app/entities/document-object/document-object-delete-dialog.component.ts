import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from './document-object.service';

@Component({
  selector: 'jhi-document-object-delete-dialog',
  templateUrl: './document-object-delete-dialog.component.html'
})
export class DocumentObjectDeleteDialogComponent {
  documentObject: IDocumentObject;

  constructor(
    protected documentObjectService: DocumentObjectService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.documentObjectService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'documentObjectListModification',
        content: 'Deleted an documentObject'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-document-object-delete-popup',
  template: ''
})
export class DocumentObjectDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DocumentObjectDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.documentObject = documentObject;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/document-object', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/document-object', { outlets: { popup: null } }]);
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
