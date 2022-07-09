import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';
import { IDocumentObject, DocumentObject } from '../document-object.model';

import { DocumentObjectService } from './document-object.service';

describe('DocumentObject Service', () => {
  let service: DocumentObjectService;
  let httpMock: HttpTestingController;
  let elemDefault: IDocumentObject;
  let expectedResult: IDocumentObject | IDocumentObject[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DocumentObjectService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      path: 'AAAAAAA',
      name: 'AAAAAAA',
      pathUuid: 'AAAAAAA',
      nameUuid: 'AAAAAAA',
      mimeType: 'AAAAAAA',
      objectUrl: 'AAAAAAA',
      thumbnailUrl: 'AAAAAAA',
      byteSize: 0,
      numberOfPages: 0,
      creation: currentDate,
      lastContentModification: currentDate,
      documentPolicy: DocumentPolicy.PRIVATE,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          creation: currentDate.format(DATE_TIME_FORMAT),
          lastContentModification: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a DocumentObject', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          creation: currentDate.format(DATE_TIME_FORMAT),
          lastContentModification: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creation: currentDate,
          lastContentModification: currentDate,
        },
        returnedFromService
      );

      service.create(new DocumentObject()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DocumentObject', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          path: 'BBBBBB',
          name: 'BBBBBB',
          pathUuid: 'BBBBBB',
          nameUuid: 'BBBBBB',
          mimeType: 'BBBBBB',
          objectUrl: 'BBBBBB',
          thumbnailUrl: 'BBBBBB',
          byteSize: 1,
          numberOfPages: 1,
          creation: currentDate.format(DATE_TIME_FORMAT),
          lastContentModification: currentDate.format(DATE_TIME_FORMAT),
          documentPolicy: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creation: currentDate,
          lastContentModification: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DocumentObject', () => {
      const patchObject = Object.assign(
        {
          pathUuid: 'BBBBBB',
          nameUuid: 'BBBBBB',
          mimeType: 'BBBBBB',
          thumbnailUrl: 'BBBBBB',
          creation: currentDate.format(DATE_TIME_FORMAT),
          lastContentModification: currentDate.format(DATE_TIME_FORMAT),
        },
        new DocumentObject()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          creation: currentDate,
          lastContentModification: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DocumentObject', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          path: 'BBBBBB',
          name: 'BBBBBB',
          pathUuid: 'BBBBBB',
          nameUuid: 'BBBBBB',
          mimeType: 'BBBBBB',
          objectUrl: 'BBBBBB',
          thumbnailUrl: 'BBBBBB',
          byteSize: 1,
          numberOfPages: 1,
          creation: currentDate.format(DATE_TIME_FORMAT),
          lastContentModification: currentDate.format(DATE_TIME_FORMAT),
          documentPolicy: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creation: currentDate,
          lastContentModification: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a DocumentObject', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDocumentObjectToCollectionIfMissing', () => {
      it('should add a DocumentObject to an empty array', () => {
        const documentObject: IDocumentObject = { id: 123 };
        expectedResult = service.addDocumentObjectToCollectionIfMissing([], documentObject);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(documentObject);
      });

      it('should not add a DocumentObject to an array that contains it', () => {
        const documentObject: IDocumentObject = { id: 123 };
        const documentObjectCollection: IDocumentObject[] = [
          {
            ...documentObject,
          },
          { id: 456 },
        ];
        expectedResult = service.addDocumentObjectToCollectionIfMissing(documentObjectCollection, documentObject);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DocumentObject to an array that doesn't contain it", () => {
        const documentObject: IDocumentObject = { id: 123 };
        const documentObjectCollection: IDocumentObject[] = [{ id: 456 }];
        expectedResult = service.addDocumentObjectToCollectionIfMissing(documentObjectCollection, documentObject);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(documentObject);
      });

      it('should add only unique DocumentObject to an array', () => {
        const documentObjectArray: IDocumentObject[] = [{ id: 123 }, { id: 456 }, { id: 79838 }];
        const documentObjectCollection: IDocumentObject[] = [{ id: 123 }];
        expectedResult = service.addDocumentObjectToCollectionIfMissing(documentObjectCollection, ...documentObjectArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const documentObject: IDocumentObject = { id: 123 };
        const documentObject2: IDocumentObject = { id: 456 };
        expectedResult = service.addDocumentObjectToCollectionIfMissing([], documentObject, documentObject2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(documentObject);
        expect(expectedResult).toContain(documentObject2);
      });

      it('should accept null and undefined values', () => {
        const documentObject: IDocumentObject = { id: 123 };
        expectedResult = service.addDocumentObjectToCollectionIfMissing([], null, documentObject, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(documentObject);
      });

      it('should return initial array if no DocumentObject is added', () => {
        const documentObjectCollection: IDocumentObject[] = [{ id: 123 }];
        expectedResult = service.addDocumentObjectToCollectionIfMissing(documentObjectCollection, undefined, null);
        expect(expectedResult).toEqual(documentObjectCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
