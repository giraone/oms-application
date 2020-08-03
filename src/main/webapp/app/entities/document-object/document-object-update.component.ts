import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IDocumentObject, DocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from './document-object.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-document-object-update',
  templateUrl: './document-object-update.component.html',
})
export class DocumentObjectUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    path: [null, [Validators.required]],
    name: [null, [Validators.required]],
    pathUuid: [null, [Validators.required]],
    nameUuid: [null, [Validators.required]],
    mimeType: [],
    objectUrl: [null, [Validators.maxLength(1024)]],
    thumbnailUrl: [null, [Validators.maxLength(1024)]],
    byteSize: [],
    numberOfPages: [],
    creation: [],
    lastContentModification: [],
    documentPolicy: [],
    ownerId: [null, Validators.required],
  });

  constructor(
    protected documentObjectService: DocumentObjectService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      if (!documentObject.id) {
        const today = moment().startOf('day');
        documentObject.creation = today;
        documentObject.lastContentModification = today;
      }

      this.updateForm(documentObject);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(documentObject: IDocumentObject): void {
    this.editForm.patchValue({
      id: documentObject.id,
      path: documentObject.path,
      name: documentObject.name,
      pathUuid: documentObject.pathUuid,
      nameUuid: documentObject.nameUuid,
      mimeType: documentObject.mimeType,
      objectUrl: documentObject.objectUrl,
      thumbnailUrl: documentObject.thumbnailUrl,
      byteSize: documentObject.byteSize,
      numberOfPages: documentObject.numberOfPages,
      creation: documentObject.creation ? documentObject.creation.format(DATE_TIME_FORMAT) : null,
      lastContentModification: documentObject.lastContentModification
        ? documentObject.lastContentModification.format(DATE_TIME_FORMAT)
        : null,
      documentPolicy: documentObject.documentPolicy,
      ownerId: documentObject.ownerId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const documentObject = this.createFromForm();
    if (documentObject.id !== undefined) {
      this.subscribeToSaveResponse(this.documentObjectService.update(documentObject));
    } else {
      this.subscribeToSaveResponse(this.documentObjectService.create(documentObject));
    }
  }

  private createFromForm(): IDocumentObject {
    return {
      ...new DocumentObject(),
      id: this.editForm.get(['id'])!.value,
      path: this.editForm.get(['path'])!.value,
      name: this.editForm.get(['name'])!.value,
      pathUuid: this.editForm.get(['pathUuid'])!.value,
      nameUuid: this.editForm.get(['nameUuid'])!.value,
      mimeType: this.editForm.get(['mimeType'])!.value,
      objectUrl: this.editForm.get(['objectUrl'])!.value,
      thumbnailUrl: this.editForm.get(['thumbnailUrl'])!.value,
      byteSize: this.editForm.get(['byteSize'])!.value,
      numberOfPages: this.editForm.get(['numberOfPages'])!.value,
      creation: this.editForm.get(['creation'])!.value ? moment(this.editForm.get(['creation'])!.value, DATE_TIME_FORMAT) : undefined,
      lastContentModification: this.editForm.get(['lastContentModification'])!.value
        ? moment(this.editForm.get(['lastContentModification'])!.value, DATE_TIME_FORMAT)
        : undefined,
      documentPolicy: this.editForm.get(['documentPolicy'])!.value,
      ownerId: this.editForm.get(['ownerId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentObject>>): void {
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

  trackById(index: number, item: IUser): any {
    return item.id;
  }
}
