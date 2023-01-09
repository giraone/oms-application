import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDocumentAccessEntry } from '../document-access-entry.model';
import { DocumentAccessEntryService } from '../service/document-access-entry.service';

@Injectable({ providedIn: 'root' })
export class DocumentAccessEntryRoutingResolveService implements Resolve<IDocumentAccessEntry | null> {
  constructor(protected service: DocumentAccessEntryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentAccessEntry | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((documentAccessEntry: HttpResponse<IDocumentAccessEntry>) => {
          if (documentAccessEntry.body) {
            return of(documentAccessEntry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
