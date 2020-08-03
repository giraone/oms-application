import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { OmsTestModule } from '../../../test.module';
import { DocumentObjectUpdateComponent } from 'app/entities/document-object/document-object-update.component';
import { DocumentObjectService } from 'app/entities/document-object/document-object.service';
import { DocumentObject } from 'app/shared/model/document-object.model';

describe('Component Tests', () => {
  describe('DocumentObject Management Update Component', () => {
    let comp: DocumentObjectUpdateComponent;
    let fixture: ComponentFixture<DocumentObjectUpdateComponent>;
    let service: DocumentObjectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OmsTestModule],
        declarations: [DocumentObjectUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(DocumentObjectUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DocumentObjectUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DocumentObjectService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new DocumentObject(123);
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
        const entity = new DocumentObject();
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
