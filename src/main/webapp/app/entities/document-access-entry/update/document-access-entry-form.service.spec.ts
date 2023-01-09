import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../document-access-entry.test-samples';

import { DocumentAccessEntryFormService } from './document-access-entry-form.service';

describe('DocumentAccessEntry Form Service', () => {
  let service: DocumentAccessEntryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentAccessEntryFormService);
  });

  describe('Service methods', () => {
    describe('createDocumentAccessEntryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDocumentAccessEntryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            access: expect.any(Object),
            until: expect.any(Object),
            document: expect.any(Object),
            grantee: expect.any(Object),
          })
        );
      });

      it('passing IDocumentAccessEntry should create a new form with FormGroup', () => {
        const formGroup = service.createDocumentAccessEntryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            access: expect.any(Object),
            until: expect.any(Object),
            document: expect.any(Object),
            grantee: expect.any(Object),
          })
        );
      });
    });

    describe('getDocumentAccessEntry', () => {
      it('should return NewDocumentAccessEntry for default DocumentAccessEntry initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDocumentAccessEntryFormGroup(sampleWithNewData);

        const documentAccessEntry = service.getDocumentAccessEntry(formGroup) as any;

        expect(documentAccessEntry).toMatchObject(sampleWithNewData);
      });

      it('should return NewDocumentAccessEntry for empty DocumentAccessEntry initial value', () => {
        const formGroup = service.createDocumentAccessEntryFormGroup();

        const documentAccessEntry = service.getDocumentAccessEntry(formGroup) as any;

        expect(documentAccessEntry).toMatchObject({});
      });

      it('should return IDocumentAccessEntry', () => {
        const formGroup = service.createDocumentAccessEntryFormGroup(sampleWithRequiredData);

        const documentAccessEntry = service.getDocumentAccessEntry(formGroup) as any;

        expect(documentAccessEntry).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDocumentAccessEntry should not enable id FormControl', () => {
        const formGroup = service.createDocumentAccessEntryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDocumentAccessEntry should disable id FormControl', () => {
        const formGroup = service.createDocumentAccessEntryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
