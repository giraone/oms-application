import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocumentAccessEntry, NewDocumentAccessEntry } from '../document-access-entry.model';

export type PartialUpdateDocumentAccessEntry = Partial<IDocumentAccessEntry> & Pick<IDocumentAccessEntry, 'id'>;

type RestOf<T extends IDocumentAccessEntry | NewDocumentAccessEntry> = Omit<T, 'until'> & {
  until?: string | null;
};

export type RestDocumentAccessEntry = RestOf<IDocumentAccessEntry>;

export type NewRestDocumentAccessEntry = RestOf<NewDocumentAccessEntry>;

export type PartialUpdateRestDocumentAccessEntry = RestOf<PartialUpdateDocumentAccessEntry>;

export type EntityResponseType = HttpResponse<IDocumentAccessEntry>;
export type EntityArrayResponseType = HttpResponse<IDocumentAccessEntry[]>;

@Injectable({ providedIn: 'root' })
export class DocumentAccessEntryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/document-access-entries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(documentAccessEntry: NewDocumentAccessEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentAccessEntry);
    return this.http
      .post<RestDocumentAccessEntry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(documentAccessEntry: IDocumentAccessEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentAccessEntry);
    return this.http
      .put<RestDocumentAccessEntry>(`${this.resourceUrl}/${this.getDocumentAccessEntryIdentifier(documentAccessEntry)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(documentAccessEntry: PartialUpdateDocumentAccessEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentAccessEntry);
    return this.http
      .patch<RestDocumentAccessEntry>(`${this.resourceUrl}/${this.getDocumentAccessEntryIdentifier(documentAccessEntry)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDocumentAccessEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDocumentAccessEntry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDocumentAccessEntryIdentifier(documentAccessEntry: Pick<IDocumentAccessEntry, 'id'>): number {
    return documentAccessEntry.id;
  }

  compareDocumentAccessEntry(o1: Pick<IDocumentAccessEntry, 'id'> | null, o2: Pick<IDocumentAccessEntry, 'id'> | null): boolean {
    return o1 && o2 ? this.getDocumentAccessEntryIdentifier(o1) === this.getDocumentAccessEntryIdentifier(o2) : o1 === o2;
  }

  addDocumentAccessEntryToCollectionIfMissing<Type extends Pick<IDocumentAccessEntry, 'id'>>(
    documentAccessEntryCollection: Type[],
    ...documentAccessEntriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const documentAccessEntries: Type[] = documentAccessEntriesToCheck.filter(isPresent);
    if (documentAccessEntries.length > 0) {
      const documentAccessEntryCollectionIdentifiers = documentAccessEntryCollection.map(
        documentAccessEntryItem => this.getDocumentAccessEntryIdentifier(documentAccessEntryItem)!
      );
      const documentAccessEntriesToAdd = documentAccessEntries.filter(documentAccessEntryItem => {
        const documentAccessEntryIdentifier = this.getDocumentAccessEntryIdentifier(documentAccessEntryItem);
        if (documentAccessEntryCollectionIdentifiers.includes(documentAccessEntryIdentifier)) {
          return false;
        }
        documentAccessEntryCollectionIdentifiers.push(documentAccessEntryIdentifier);
        return true;
      });
      return [...documentAccessEntriesToAdd, ...documentAccessEntryCollection];
    }
    return documentAccessEntryCollection;
  }

  protected convertDateFromClient<T extends IDocumentAccessEntry | NewDocumentAccessEntry | PartialUpdateDocumentAccessEntry>(
    documentAccessEntry: T
  ): RestOf<T> {
    return {
      ...documentAccessEntry,
      until: documentAccessEntry.until?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDocumentAccessEntry: RestDocumentAccessEntry): IDocumentAccessEntry {
    return {
      ...restDocumentAccessEntry,
      until: restDocumentAccessEntry.until ? dayjs(restDocumentAccessEntry.until) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDocumentAccessEntry>): HttpResponse<IDocumentAccessEntry> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDocumentAccessEntry[]>): HttpResponse<IDocumentAccessEntry[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
