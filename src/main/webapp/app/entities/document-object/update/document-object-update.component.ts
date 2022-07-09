import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDocumentObject, DocumentObject } from '../document-object.model';
import { DocumentObjectService } from '../service/document-object.service';
import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';

@Component({
  selector: 'jhi-document-object-update',
  templateUrl: './document-object-update.component.html',
})
export class DocumentObjectUpdateComponent implements OnInit {
  isSaving = false;
  documentPolicyValues = Object.keys(DocumentPolicy);

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
  });

  constructor(
    protected documentObjectService: DocumentObjectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      if (documentObject.id === undefined) {
        const today = dayjs().startOf('day');
        documentObject.creation = today;
        documentObject.lastContentModification = today;
      }

      this.updateForm(documentObject);
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentObject>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(documentObject: IDocumentObject): void {
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
    });
  }

  protected createFromForm(): IDocumentObject {
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
      creation: this.editForm.get(['creation'])!.value ? dayjs(this.editForm.get(['creation'])!.value, DATE_TIME_FORMAT) : undefined,
      lastContentModification: this.editForm.get(['lastContentModification'])!.value
        ? dayjs(this.editForm.get(['lastContentModification'])!.value, DATE_TIME_FORMAT)
        : undefined,
      documentPolicy: this.editForm.get(['documentPolicy'])!.value,
    };
  }
}
