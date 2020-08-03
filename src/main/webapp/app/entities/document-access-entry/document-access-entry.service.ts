import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDocumentAccessEntry } from 'app/shared/model/document-access-entry.model';

type EntityResponseType = HttpResponse<IDocumentAccessEntry>;
type EntityArrayResponseType = HttpResponse<IDocumentAccessEntry[]>;

@Injectable({ providedIn: 'root' })
export class DocumentAccessEntryService {
  public resourceUrl = SERVER_API_URL + 'api/document-access-entries';

  constructor(protected http: HttpClient) {}

  create(documentAccessEntry: IDocumentAccessEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentAccessEntry);
    return this.http
      .post<IDocumentAccessEntry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(documentAccessEntry: IDocumentAccessEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentAccessEntry);
    return this.http
      .put<IDocumentAccessEntry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDocumentAccessEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocumentAccessEntry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(documentAccessEntry: IDocumentAccessEntry): IDocumentAccessEntry {
    const copy: IDocumentAccessEntry = Object.assign({}, documentAccessEntry, {
      until: documentAccessEntry.until && documentAccessEntry.until.isValid() ? documentAccessEntry.until.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.until = res.body.until ? moment(res.body.until) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((documentAccessEntry: IDocumentAccessEntry) => {
        documentAccessEntry.until = documentAccessEntry.until ? moment(documentAccessEntry.until) : undefined;
      });
    }
    return res;
  }
}
