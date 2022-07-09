import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocumentObject, getDocumentObjectIdentifier } from '../document-object.model';

export type EntityResponseType = HttpResponse<IDocumentObject>;
export type EntityArrayResponseType = HttpResponse<IDocumentObject[]>;

@Injectable({ providedIn: 'root' })
export class DocumentObjectService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/document-objects');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(documentObject: IDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .post<IDocumentObject>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(documentObject: IDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .put<IDocumentObject>(`${this.resourceUrl}/${getDocumentObjectIdentifier(documentObject) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(documentObject: IDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .patch<IDocumentObject>(`${this.resourceUrl}/${getDocumentObjectIdentifier(documentObject) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDocumentObject>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocumentObject[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDocumentObjectToCollectionIfMissing(
    documentObjectCollection: IDocumentObject[],
    ...documentObjectsToCheck: (IDocumentObject | null | undefined)[]
  ): IDocumentObject[] {
    const documentObjects: IDocumentObject[] = documentObjectsToCheck.filter(isPresent);
    if (documentObjects.length > 0) {
      const documentObjectCollectionIdentifiers = documentObjectCollection.map(
        documentObjectItem => getDocumentObjectIdentifier(documentObjectItem)!
      );
      const documentObjectsToAdd = documentObjects.filter(documentObjectItem => {
        const documentObjectIdentifier = getDocumentObjectIdentifier(documentObjectItem);
        if (documentObjectIdentifier == null || documentObjectCollectionIdentifiers.includes(documentObjectIdentifier)) {
          return false;
        }
        documentObjectCollectionIdentifiers.push(documentObjectIdentifier);
        return true;
      });
      return [...documentObjectsToAdd, ...documentObjectCollection];
    }
    return documentObjectCollection;
  }

  protected convertDateFromClient(documentObject: IDocumentObject): IDocumentObject {
    return Object.assign({}, documentObject, {
      creation: documentObject.creation?.isValid() ? documentObject.creation.toJSON() : undefined,
      lastContentModification: documentObject.lastContentModification?.isValid()
        ? documentObject.lastContentModification.toJSON()
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creation = res.body.creation ? dayjs(res.body.creation) : undefined;
      res.body.lastContentModification = res.body.lastContentModification ? dayjs(res.body.lastContentModification) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((documentObject: IDocumentObject) => {
        documentObject.creation = documentObject.creation ? dayjs(documentObject.creation) : undefined;
        documentObject.lastContentModification = documentObject.lastContentModification
          ? dayjs(documentObject.lastContentModification)
          : undefined;
      });
    }
    return res;
  }
}
