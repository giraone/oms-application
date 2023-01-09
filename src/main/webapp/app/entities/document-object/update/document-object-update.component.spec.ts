import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DocumentObjectFormService } from './document-object-form.service';
import { DocumentObjectService } from '../service/document-object.service';
import { IDocumentObject } from '../document-object.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { DocumentObjectUpdateComponent } from './document-object-update.component';

describe('DocumentObject Management Update Component', () => {
  let comp: DocumentObjectUpdateComponent;
  let fixture: ComponentFixture<DocumentObjectUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let documentObjectFormService: DocumentObjectFormService;
  let documentObjectService: DocumentObjectService;
  let userService: UserService;

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
    documentObjectFormService = TestBed.inject(DocumentObjectFormService);
    documentObjectService = TestBed.inject(DocumentObjectService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const documentObject: IDocumentObject = { id: 456 };
      const owner: IUser = { id: 48368 };
      documentObject.owner = owner;

      const userCollection: IUser[] = [{ id: 34707 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [owner];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ documentObject });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const documentObject: IDocumentObject = { id: 456 };
      const owner: IUser = { id: 73187 };
      documentObject.owner = owner;

      activatedRoute.data = of({ documentObject });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(owner);
      expect(comp.documentObject).toEqual(documentObject);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumentObject>>();
      const documentObject = { id: 123 };
      jest.spyOn(documentObjectFormService, 'getDocumentObject').mockReturnValue(documentObject);
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
      expect(documentObjectFormService.getDocumentObject).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(documentObjectService.update).toHaveBeenCalledWith(expect.objectContaining(documentObject));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumentObject>>();
      const documentObject = { id: 123 };
      jest.spyOn(documentObjectFormService, 'getDocumentObject').mockReturnValue({ id: null });
      jest.spyOn(documentObjectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documentObject: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documentObject }));
      saveSubject.complete();

      // THEN
      expect(documentObjectFormService.getDocumentObject).toHaveBeenCalled();
      expect(documentObjectService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumentObject>>();
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
      expect(documentObjectService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
