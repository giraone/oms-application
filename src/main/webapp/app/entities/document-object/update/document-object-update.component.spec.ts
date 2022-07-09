import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DocumentObjectService } from '../service/document-object.service';
import { IDocumentObject, DocumentObject } from '../document-object.model';

import { DocumentObjectUpdateComponent } from './document-object-update.component';

describe('DocumentObject Management Update Component', () => {
  let comp: DocumentObjectUpdateComponent;
  let fixture: ComponentFixture<DocumentObjectUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let documentObjectService: DocumentObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DocumentObjectUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DocumentObjectUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocumentObjectUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    documentObjectService = TestBed.inject(DocumentObjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const documentObject: IDocumentObject = { id: 456 };

      activatedRoute.data = of({ documentObject });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(documentObject));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DocumentObject>>();
      const documentObject = { id: 123 };
      jest.spyOn(documentObjectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documentObject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documentObject }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(documentObjectService.update).toHaveBeenCalledWith(documentObject);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DocumentObject>>();
      const documentObject = new DocumentObject();
      jest.spyOn(documentObjectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documentObject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documentObject }));
      saveSubject.complete();

      // THEN
      expect(documentObjectService.create).toHaveBeenCalledWith(documentObject);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DocumentObject>>();
      const documentObject = { id: 123 };
      jest.spyOn(documentObjectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documentObject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(documentObjectService.update).toHaveBeenCalledWith(documentObject);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
