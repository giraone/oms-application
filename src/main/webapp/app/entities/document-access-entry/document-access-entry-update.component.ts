import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IDocumentAccessEntry, DocumentAccessEntry } from 'app/shared/model/document-access-entry.model';
import { DocumentAccessEntryService } from './document-access-entry.service';
import { IDocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from 'app/entities/document-object/document-object.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-document-access-entry-update',
  templateUrl: './document-access-entry-update.component.html'
})
export class DocumentAccessEntryUpdateComponent implements OnInit {
  isSaving: boolean;

  documentobjects: IDocumentObject[];

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    access: [null, [Validators.required]],
    until: [],
    documentId: [null, Validators.required],
    granteeId: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected documentAccessEntryService: DocumentAccessEntryService,
    protected documentObjectService: DocumentObjectService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ documentAccessEntry }) => {
      this.updateForm(documentAccessEntry);
    });
    this.documentObjectService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IDocumentObject[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDocumentObject[]>) => response.body)
      )
      .subscribe((res: IDocumentObject[]) => (this.documentobjects = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(documentAccessEntry: IDocumentAccessEntry) {
    this.editForm.patchValue({
      id: documentAccessEntry.id,
      access: documentAccessEntry.access,
      until: documentAccessEntry.until != null ? documentAccessEntry.until.format(DATE_TIME_FORMAT) : null,
      documentId: documentAccessEntry.documentId,
      granteeId: documentAccessEntry.granteeId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const documentAccessEntry = this.createFromForm();
    if (documentAccessEntry.id !== undefined) {
      this.subscribeToSaveResponse(this.documentAccessEntryService.update(documentAccessEntry));
    } else {
      this.subscribeToSaveResponse(this.documentAccessEntryService.create(documentAccessEntry));
    }
  }

  private createFromForm(): IDocumentAccessEntry {
    return {
      ...new DocumentAccessEntry(),
      id: this.editForm.get(['id']).value,
      access: this.editForm.get(['access']).value,
      until: this.editForm.get(['until']).value != null ? moment(this.editForm.get(['until']).value, DATE_TIME_FORMAT) : undefined,
      documentId: this.editForm.get(['documentId']).value,
      granteeId: this.editForm.get(['granteeId']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentAccessEntry>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackDocumentObjectById(index: number, item: IDocumentObject) {
    return item.id;
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
