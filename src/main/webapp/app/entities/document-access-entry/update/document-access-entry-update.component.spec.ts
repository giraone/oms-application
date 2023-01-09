import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DocumentAccessEntryFormService } from './document-access-entry-form.service';
import { DocumentAccessEntryService } from '../service/document-access-entry.service';
import { IDocumentAccessEntry } from '../document-access-entry.model';
import { IDocumentObject } from 'app/entities/document-object/document-object.model';
import { DocumentObjectService } from 'app/entities/document-object/service/document-object.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { DocumentAccessEntryUpdateComponent } from './document-access-entry-update.component';

describe('DocumentAccessEntry Management Update Component', () => {
  let comp: DocumentAccessEntryUpdateComponent;
  let fixture: ComponentFixture<DocumentAccessEntryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let documentAccessEntryFormService: DocumentAccessEntryFormService;
  let documentAccessEntryService: DocumentAccessEntryService;
  let documentObjectService: DocumentObjectService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DocumentAccessEntryUpdateComponent],
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
      .overrideTemplate(DocumentAccessEntryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocumentAccessEntryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    documentAccessEntryFormService = TestBed.inject(DocumentAccessEntryFormService);
    documentAccessEntryService = TestBed.inject(DocumentAccessEntryService);
    documentObjectService = TestBed.inject(DocumentObjectService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DocumentObject query and add missing value', () => {
      const documentAccessEntry: IDocumentAccessEntry = { id: 456 };
      const document: IDocumentObject = { id: 27305 };
      documentAccessEntry.document = document;

      const documentObjectCollection: IDocumentObject[] = [{ id: 10253 }];
      jest.spyOn(documentObjectService, 'query').mockReturnValue(of(new HttpResponse({ body: documentObjectCollection })));
      const additionalDocumentObjects = [document];
      const expectedCollection: IDocumentObject[] = [...additionalDocumentObjects, ...documentObjectCollection];
      jest.spyOn(documentObjectService, 'addDocumentObjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ documentAccessEntry });
      comp.ngOnInit();

      expect(documentObjectService.query).toHaveBeenCalled();
      expect(documentObjectService.addDocumentObjectToCollectionIfMissing).toHaveBeenCalledWith(
        documentObjectCollection,
        ...additionalDocumentObjects.map(expect.objectContaining)
      );
      expect(comp.documentObjectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const documentAccessEntry: IDocumentAccessEntry = { id: 456 };
      const grantee: IUser = { id: 53881 };
      documentAccessEntry.grantee = grantee;

      const userCollection: IUser[] = [{ id: 49339 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [grantee];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ documentAccessEntry });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const documentAccessEntry: IDocumentAccessEntry = { id: 456 };
      const document: IDocumentObject = { id: 17853 };
      documentAccessEntry.document = document;
      const grantee: IUser = { id: 15760 };
      documentAccessEntry.grantee = grantee;

      activatedRoute.data = of({ documentAccessEntry });
      comp.ngOnInit();

      expect(comp.documentObjectsSharedCollection).toContain(document);
      expect(comp.usersSharedCollection).toContain(grantee);
      expect(comp.documentAccessEntry).toEqual(documentAccessEntry);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumentAccessEntry>>();
      const documentAccessEntry = { id: 123 };
      jest.spyOn(documentAccessEntryFormService, 'getDocumentAccessEntry').mockReturnValue(documentAccessEntry);
      jest.spyOn(documentAccessEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documentAccessEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documentAccessEntry }));
      saveSubject.complete();

      // THEN
      expect(documentAccessEntryFormService.getDocumentAccessEntry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(documentAccessEntryService.update).toHaveBeenCalledWith(expect.objectContaining(documentAccessEntry));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumentAccessEntry>>();
      const documentAccessEntry = { id: 123 };
      jest.spyOn(documentAccessEntryFormService, 'getDocumentAccessEntry').mockReturnValue({ id: null });
      jest.spyOn(documentAccessEntryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documentAccessEntry: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documentAccessEntry }));
      saveSubject.complete();

      // THEN
      expect(documentAccessEntryFormService.getDocumentAccessEntry).toHaveBeenCalled();
      expect(documentAccessEntryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumentAccessEntry>>();
      const documentAccessEntry = { id: 123 };
      jest.spyOn(documentAccessEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documentAccessEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(documentAccessEntryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDocumentObject', () => {
      it('Should forward to documentObjectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(documentObjectService, 'compareDocumentObject');
        comp.compareDocumentObject(entity, entity2);
        expect(documentObjectService.compareDocumentObject).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
