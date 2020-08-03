import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IDocumentAccessEntry, DocumentAccessEntry } from 'app/shared/model/document-access-entry.model';
import { DocumentAccessEntryService } from './document-access-entry.service';
import { IDocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from 'app/entities/document-object/document-object.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

type SelectableEntity = IDocumentObject | IUser;

@Component({
  selector: 'jhi-document-access-entry-update',
  templateUrl: './document-access-entry-update.component.html',
})
export class DocumentAccessEntryUpdateComponent implements OnInit {
  isSaving = false;
  documentobjects: IDocumentObject[] = [];
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    access: [null, [Validators.required]],
    until: [],
    documentId: [null, Validators.required],
    granteeId: [null, Validators.required],
  });

  constructor(
    protected documentAccessEntryService: DocumentAccessEntryService,
    protected documentObjectService: DocumentObjectService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentAccessEntry }) => {
      if (!documentAccessEntry.id) {
        const today = moment().startOf('day');
        documentAccessEntry.until = today;
      }

      this.updateForm(documentAccessEntry);

      this.documentObjectService.query().subscribe((res: HttpResponse<IDocumentObject[]>) => (this.documentobjects = res.body || []));

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(documentAccessEntry: IDocumentAccessEntry): void {
    this.editForm.patchValue({
      id: documentAccessEntry.id,
      access: documentAccessEntry.access,
      until: documentAccessEntry.until ? documentAccessEntry.until.format(DATE_TIME_FORMAT) : null,
      documentId: documentAccessEntry.documentId,
      granteeId: documentAccessEntry.granteeId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
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
      id: this.editForm.get(['id'])!.value,
      access: this.editForm.get(['access'])!.value,
      until: this.editForm.get(['until'])!.value ? moment(this.editForm.get(['until'])!.value, DATE_TIME_FORMAT) : undefined,
      documentId: this.editForm.get(['documentId'])!.value,
      granteeId: this.editForm.get(['granteeId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentAccessEntry>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
