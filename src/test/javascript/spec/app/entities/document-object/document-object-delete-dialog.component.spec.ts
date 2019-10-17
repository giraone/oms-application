import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { OmsTestModule } from '../../../test.module';
import { DocumentObjectDeleteDialogComponent } from 'app/entities/document-object/document-object-delete-dialog.component';
import { DocumentObjectService } from 'app/entities/document-object/document-object.service';

describe('Component Tests', () => {
  describe('DocumentObject Management Delete Component', () => {
    let comp: DocumentObjectDeleteDialogComponent;
    let fixture: ComponentFixture<DocumentObjectDeleteDialogComponent>;
    let service: DocumentObjectService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OmsTestModule],
        declarations: [DocumentObjectDeleteDialogComponent]
      })
        .overrideTemplate(DocumentObjectDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DocumentObjectDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DocumentObjectService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
