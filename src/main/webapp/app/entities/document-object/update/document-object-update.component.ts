import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DocumentObjectFormService, DocumentObjectFormGroup } from './document-object-form.service';
import { IDocumentObject } from '../document-object.model';
import { DocumentObjectService } from '../service/document-object.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';

@Component({
  selector: 'jhi-document-object-update',
  templateUrl: './document-object-update.component.html',
})
export class DocumentObjectUpdateComponent implements OnInit {
  isSaving = false;
  documentObject: IDocumentObject | null = null;
  documentPolicyValues = Object.keys(DocumentPolicy);

  usersSharedCollection: IUser[] = [];

  editForm: DocumentObjectFormGroup = this.documentObjectFormService.createDocumentObjectFormGroup();

  constructor(
    protected documentObjectService: DocumentObjectService,
    protected documentObjectFormService: DocumentObjectFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      this.documentObject = documentObject;
      if (documentObject) {
        this.updateForm(documentObject);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const documentObject = this.documentObjectFormService.getDocumentObject(this.editForm);
    if (documentObject.id !== null) {
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
    this.documentObject = documentObject;
    this.documentObjectFormService.resetForm(this.editForm, documentObject);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, documentObject.owner);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.documentObject?.owner)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
