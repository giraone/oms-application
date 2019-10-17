import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { OmsTestModule } from '../../../test.module';
import { DocumentAccessEntryUpdateComponent } from 'app/entities/document-access-entry/document-access-entry-update.component';
import { DocumentAccessEntryService } from 'app/entities/document-access-entry/document-access-entry.service';
import { DocumentAccessEntry } from 'app/shared/model/document-access-entry.model';

describe('Component Tests', () => {
  describe('DocumentAccessEntry Management Update Component', () => {
    let comp: DocumentAccessEntryUpdateComponent;
    let fixture: ComponentFixture<DocumentAccessEntryUpdateComponent>;
    let service: DocumentAccessEntryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OmsTestModule],
        declarations: [DocumentAccessEntryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DocumentAccessEntryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DocumentAccessEntryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DocumentAccessEntryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new DocumentAccessEntry(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new DocumentAccessEntry();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
