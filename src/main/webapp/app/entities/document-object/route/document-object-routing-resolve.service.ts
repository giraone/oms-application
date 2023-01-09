import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDocumentObject } from '../document-object.model';
import { DocumentObjectService } from '../service/document-object.service';

@Injectable({ providedIn: 'root' })
export class DocumentObjectRoutingResolveService implements Resolve<IDocumentObject | null> {
  constructor(protected service: DocumentObjectService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentObject | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((documentObject: HttpResponse<IDocumentObject>) => {
          if (documentObject.body) {
            return of(documentObject.body);
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
