import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDocumentObject, DocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from '../../entities/document-object/document-object.service';
import { DocumentsService } from './documents.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-document-tools',
  templateUrl: './document-tools.component.html'
})
export class DocumentToolsComponent implements OnInit {

  users: IUser[];

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected documentObjectService: DocumentObjectService,
    protected documentsService: DocumentsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {

    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
