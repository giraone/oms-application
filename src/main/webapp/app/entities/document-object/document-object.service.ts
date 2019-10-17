import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post<IDocumentObject>(this.resourceUrl, documentObject, { observe: 'response' });
  }

  update(documentObject: IDocumentObject): Observable<EntityResponseType> {
    return this.http.put<IDocumentObject>(this.resourceUrl, documentObject, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDocumentObject>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocumentObject[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
