import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDocumentAccessEntry } from '../document-access-entry.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../document-access-entry.test-samples';

import { DocumentAccessEntryService, RestDocumentAccessEntry } from './document-access-entry.service';

const requireRestSample: RestDocumentAccessEntry = {
  ...sampleWithRequiredData,
  until: sampleWithRequiredData.until?.toJSON(),
};

describe('DocumentAccessEntry Service', () => {
  let service: DocumentAccessEntryService;
  let httpMock: HttpTestingController;
  let expectedResult: IDocumentAccessEntry | IDocumentAccessEntry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DocumentAccessEntryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a DocumentAccessEntry', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const documentAccessEntry = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(documentAccessEntry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DocumentAccessEntry', () => {
      const documentAccessEntry = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(documentAccessEntry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DocumentAccessEntry', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DocumentAccessEntry', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DocumentAccessEntry', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDocumentAccessEntryToCollectionIfMissing', () => {
      it('should add a DocumentAccessEntry to an empty array', () => {
        const documentAccessEntry: IDocumentAccessEntry = sampleWithRequiredData;
        expectedResult = service.addDocumentAccessEntryToCollectionIfMissing([], documentAccessEntry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(documentAccessEntry);
      });

      it('should not add a DocumentAccessEntry to an array that contains it', () => {
        const documentAccessEntry: IDocumentAccessEntry = sampleWithRequiredData;
        const documentAccessEntryCollection: IDocumentAccessEntry[] = [
          {
            ...documentAccessEntry,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDocumentAccessEntryToCollectionIfMissing(documentAccessEntryCollection, documentAccessEntry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DocumentAccessEntry to an array that doesn't contain it", () => {
        const documentAccessEntry: IDocumentAccessEntry = sampleWithRequiredData;
        const documentAccessEntryCollection: IDocumentAccessEntry[] = [sampleWithPartialData];
        expectedResult = service.addDocumentAccessEntryToCollectionIfMissing(documentAccessEntryCollection, documentAccessEntry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(documentAccessEntry);
      });

      it('should add only unique DocumentAccessEntry to an array', () => {
        const documentAccessEntryArray: IDocumentAccessEntry[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const documentAccessEntryCollection: IDocumentAccessEntry[] = [sampleWithRequiredData];
        expectedResult = service.addDocumentAccessEntryToCollectionIfMissing(documentAccessEntryCollection, ...documentAccessEntryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const documentAccessEntry: IDocumentAccessEntry = sampleWithRequiredData;
        const documentAccessEntry2: IDocumentAccessEntry = sampleWithPartialData;
        expectedResult = service.addDocumentAccessEntryToCollectionIfMissing([], documentAccessEntry, documentAccessEntry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(documentAccessEntry);
        expect(expectedResult).toContain(documentAccessEntry2);
      });

      it('should accept null and undefined values', () => {
        const documentAccessEntry: IDocumentAccessEntry = sampleWithRequiredData;
        expectedResult = service.addDocumentAccessEntryToCollectionIfMissing([], null, documentAccessEntry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(documentAccessEntry);
      });

      it('should return initial array if no DocumentAccessEntry is added', () => {
        const documentAccessEntryCollection: IDocumentAccessEntry[] = [sampleWithRequiredData];
        expectedResult = service.addDocumentAccessEntryToCollectionIfMissing(documentAccessEntryCollection, undefined, null);
        expect(expectedResult).toEqual(documentAccessEntryCollection);
      });
    });

    describe('compareDocumentAccessEntry', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDocumentAccessEntry(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDocumentAccessEntry(entity1, entity2);
        const compareResult2 = service.compareDocumentAccessEntry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDocumentAccessEntry(entity1, entity2);
        const compareResult2 = service.compareDocumentAccessEntry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDocumentAccessEntry(entity1, entity2);
        const compareResult2 = service.compareDocumentAccessEntry(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
