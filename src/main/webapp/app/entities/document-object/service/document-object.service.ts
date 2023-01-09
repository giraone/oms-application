import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocumentObject, NewDocumentObject } from '../document-object.model';

export type PartialUpdateDocumentObject = Partial<IDocumentObject> & Pick<IDocumentObject, 'id'>;

type RestOf<T extends IDocumentObject | NewDocumentObject> = Omit<T, 'creation' | 'lastContentModification'> & {
  creation?: string | null;
  lastContentModification?: string | null;
};

export type RestDocumentObject = RestOf<IDocumentObject>;

export type NewRestDocumentObject = RestOf<NewDocumentObject>;

export type PartialUpdateRestDocumentObject = RestOf<PartialUpdateDocumentObject>;

export type EntityResponseType = HttpResponse<IDocumentObject>;
export type EntityArrayResponseType = HttpResponse<IDocumentObject[]>;

@Injectable({ providedIn: 'root' })
export class DocumentObjectService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/document-objects');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(documentObject: NewDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .post<RestDocumentObject>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(documentObject: IDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .put<RestDocumentObject>(`${this.resourceUrl}/${this.getDocumentObjectIdentifier(documentObject)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(documentObject: PartialUpdateDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .patch<RestDocumentObject>(`${this.resourceUrl}/${this.getDocumentObjectIdentifier(documentObject)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDocumentObject>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDocumentObject[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDocumentObjectIdentifier(documentObject: Pick<IDocumentObject, 'id'>): number {
    return documentObject.id;
  }

  compareDocumentObject(o1: Pick<IDocumentObject, 'id'> | null, o2: Pick<IDocumentObject, 'id'> | null): boolean {
    return o1 && o2 ? this.getDocumentObjectIdentifier(o1) === this.getDocumentObjectIdentifier(o2) : o1 === o2;
  }

  addDocumentObjectToCollectionIfMissing<Type extends Pick<IDocumentObject, 'id'>>(
    documentObjectCollection: Type[],
    ...documentObjectsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const documentObjects: Type[] = documentObjectsToCheck.filter(isPresent);
    if (documentObjects.length > 0) {
      const documentObjectCollectionIdentifiers = documentObjectCollection.map(
        documentObjectItem => this.getDocumentObjectIdentifier(documentObjectItem)!
      );
      const documentObjectsToAdd = documentObjects.filter(documentObjectItem => {
        const documentObjectIdentifier = this.getDocumentObjectIdentifier(documentObjectItem);
        if (documentObjectCollectionIdentifiers.includes(documentObjectIdentifier)) {
          return false;
        }
        documentObjectCollectionIdentifiers.push(documentObjectIdentifier);
        return true;
      });
      return [...documentObjectsToAdd, ...documentObjectCollection];
    }
    return documentObjectCollection;
  }

  protected convertDateFromClient<T extends IDocumentObject | NewDocumentObject | PartialUpdateDocumentObject>(
    documentObject: T
  ): RestOf<T> {
    return {
      ...documentObject,
      creation: documentObject.creation?.toJSON() ?? null,
      lastContentModification: documentObject.lastContentModification?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDocumentObject: RestDocumentObject): IDocumentObject {
    return {
      ...restDocumentObject,
      creation: restDocumentObject.creation ? dayjs(restDocumentObject.creation) : undefined,
      lastContentModification: restDocumentObject.lastContentModification ? dayjs(restDocumentObject.lastContentModification) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDocumentObject>): HttpResponse<IDocumentObject> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDocumentObject[]>): HttpResponse<IDocumentObject[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
