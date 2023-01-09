import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../document-object.test-samples';

import { DocumentObjectFormService } from './document-object-form.service';

describe('DocumentObject Form Service', () => {
  let service: DocumentObjectFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentObjectFormService);
  });

  describe('Service methods', () => {
    describe('createDocumentObjectFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDocumentObjectFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            path: expect.any(Object),
            name: expect.any(Object),
            pathUuid: expect.any(Object),
            nameUuid: expect.any(Object),
            mimeType: expect.any(Object),
            objectUrl: expect.any(Object),
            thumbnailUrl: expect.any(Object),
            byteSize: expect.any(Object),
            numberOfPages: expect.any(Object),
            creation: expect.any(Object),
            lastContentModification: expect.any(Object),
            documentPolicy: expect.any(Object),
            owner: expect.any(Object),
          })
        );
      });

      it('passing IDocumentObject should create a new form with FormGroup', () => {
        const formGroup = service.createDocumentObjectFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            path: expect.any(Object),
            name: expect.any(Object),
            pathUuid: expect.any(Object),
            nameUuid: expect.any(Object),
            mimeType: expect.any(Object),
            objectUrl: expect.any(Object),
            thumbnailUrl: expect.any(Object),
            byteSize: expect.any(Object),
            numberOfPages: expect.any(Object),
            creation: expect.any(Object),
            lastContentModification: expect.any(Object),
            documentPolicy: expect.any(Object),
            owner: expect.any(Object),
          })
        );
      });
    });

    describe('getDocumentObject', () => {
      it('should return NewDocumentObject for default DocumentObject initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDocumentObjectFormGroup(sampleWithNewData);

        const documentObject = service.getDocumentObject(formGroup) as any;

        expect(documentObject).toMatchObject(sampleWithNewData);
      });

      it('should return NewDocumentObject for empty DocumentObject initial value', () => {
        const formGroup = service.createDocumentObjectFormGroup();

        const documentObject = service.getDocumentObject(formGroup) as any;

        expect(documentObject).toMatchObject({});
      });

      it('should return IDocumentObject', () => {
        const formGroup = service.createDocumentObjectFormGroup(sampleWithRequiredData);

        const documentObject = service.getDocumentObject(formGroup) as any;

        expect(documentObject).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDocumentObject should not enable id FormControl', () => {
        const formGroup = service.createDocumentObjectFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDocumentObject should disable id FormControl', () => {
        const formGroup = service.createDocumentObjectFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
