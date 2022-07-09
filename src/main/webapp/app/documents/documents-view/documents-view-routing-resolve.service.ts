import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DocumentObjectRead, IDocumentObjectRead } from './document-read-write.model';
import { DocumentsService } from './documents.service';

@Injectable({ providedIn: 'root' })
export class DocumentsViewRoutingResolveService implements Resolve<IDocumentObjectRead> {
  constructor(protected service: DocumentsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentObjectRead> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((documentObject: HttpResponse<IDocumentObjectRead>) => {
          if (documentObject.body) {
            return of(documentObject.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DocumentObjectRead());
  }
}
