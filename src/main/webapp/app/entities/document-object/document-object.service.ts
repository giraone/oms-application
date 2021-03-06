import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDocumentObject } from 'app/shared/model/document-object.model';

type EntityResponseType = HttpResponse<IDocumentObject>;
type EntityArrayResponseType = HttpResponse<IDocumentObject[]>;

@Injectable({ providedIn: 'root' })
export class DocumentObjectService {
  public resourceUrl = SERVER_API_URL + 'api/document-objects';

  constructor(protected http: HttpClient) {}

  create(documentObject: IDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .post<IDocumentObject>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(documentObject: IDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .put<IDocumentObject>(this.resourceUrl, copy, { observe: 'response' })
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

  protected convertDateFromClient(documentObject: IDocumentObject): IDocumentObject {
    const copy: IDocumentObject = Object.assign({}, documentObject, {
      creation: documentObject.creation && documentObject.creation.isValid() ? documentObject.creation.toJSON() : undefined,
      lastContentModification:
        documentObject.lastContentModification && documentObject.lastContentModification.isValid()
          ? documentObject.lastContentModification.toJSON()
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creation = res.body.creation ? moment(res.body.creation) : undefined;
      res.body.lastContentModification = res.body.lastContentModification ? moment(res.body.lastContentModification) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((documentObject: IDocumentObject) => {
        documentObject.creation = documentObject.creation ? moment(documentObject.creation) : undefined;
        documentObject.lastContentModification = documentObject.lastContentModification
          ? moment(documentObject.lastContentModification)
          : undefined;
      });
    }
    return res;
  }
}
