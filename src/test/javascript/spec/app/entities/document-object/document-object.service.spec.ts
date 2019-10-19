import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import { DocumentObjectService } from 'app/entities/document-object/document-object.service';
import { IDocumentObject, DocumentObject } from 'app/shared/model/document-object.model';

describe('Service Tests', () => {
  describe('DocumentObject Service', () => {
    let injector: TestBed;
    let service: DocumentObjectService;
    let httpMock: HttpTestingController;
    let elemDefault: IDocumentObject;
    let expectedResult;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(DocumentObjectService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new DocumentObject(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 0, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a DocumentObject', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );
        const expected = Object.assign({}, returnedFromService);
        service
          .create(new DocumentObject(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a DocumentObject', () => {
        const returnedFromService = Object.assign(
          {
            path: 'BBBBBB',
            name: 'BBBBBB',
            pathUuid: 'BBBBBB',
            nameUuid: 'BBBBBB',
            mimeType: 'BBBBBB',
            objectUrl: 'BBBBBB',
            thumbnailUrl: 'BBBBBB',
            byteSize: 1,
            numberOfPages: 1
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of DocumentObject', () => {
        const returnedFromService = Object.assign(
          {
            path: 'BBBBBB',
            name: 'BBBBBB',
            pathUuid: 'BBBBBB',
            nameUuid: 'BBBBBB',
            mimeType: 'BBBBBB',
            objectUrl: 'BBBBBB',
            thumbnailUrl: 'BBBBBB',
            byteSize: 1,
            numberOfPages: 1
          },
          elemDefault
        );
        const expected = Object.assign({}, returnedFromService);
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
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
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
