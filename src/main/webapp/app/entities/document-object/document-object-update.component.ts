import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDocumentObject, DocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from './document-object.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-document-object-update',
  templateUrl: './document-object-update.component.html'
})
export class DocumentObjectUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    path: [null, [Validators.required]],
    name: [null, [Validators.required]],
    mimeType: [],
    objectUrl: [],
    thumbnailUrl: [],
    byteSize: [],
    numberOfPages: [],
    ownerId: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected documentObjectService: DocumentObjectService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      this.updateForm(documentObject);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(documentObject: IDocumentObject) {
    this.editForm.patchValue({
      id: documentObject.id,
      path: documentObject.path,
      name: documentObject.name,
      mimeType: documentObject.mimeType,
      objectUrl: documentObject.objectUrl,
      thumbnailUrl: documentObject.thumbnailUrl,
      byteSize: documentObject.byteSize,
      numberOfPages: documentObject.numberOfPages,
      ownerId: documentObject.ownerId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
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
      id: this.editForm.get(['id']).value,
      path: this.editForm.get(['path']).value,
      name: this.editForm.get(['name']).value,
      mimeType: this.editForm.get(['mimeType']).value,
      objectUrl: this.editForm.get(['objectUrl']).value,
      thumbnailUrl: this.editForm.get(['thumbnailUrl']).value,
      byteSize: this.editForm.get(['byteSize']).value,
      numberOfPages: this.editForm.get(['numberOfPages']).value,
      ownerId: this.editForm.get(['ownerId']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentObject>>) {
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

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
