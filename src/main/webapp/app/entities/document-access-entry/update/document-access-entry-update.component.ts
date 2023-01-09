import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DocumentAccessEntryFormService, DocumentAccessEntryFormGroup } from './document-access-entry-form.service';
import { IDocumentAccessEntry } from '../document-access-entry.model';
import { DocumentAccessEntryService } from '../service/document-access-entry.service';
import { IDocumentObject } from 'app/entities/document-object/document-object.model';
import { DocumentObjectService } from 'app/entities/document-object/service/document-object.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { AccessType } from 'app/entities/enumerations/access-type.model';

@Component({
  selector: 'jhi-document-access-entry-update',
  templateUrl: './document-access-entry-update.component.html',
})
export class DocumentAccessEntryUpdateComponent implements OnInit {
  isSaving = false;
  documentAccessEntry: IDocumentAccessEntry | null = null;
  accessTypeValues = Object.keys(AccessType);

  documentObjectsSharedCollection: IDocumentObject[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: DocumentAccessEntryFormGroup = this.documentAccessEntryFormService.createDocumentAccessEntryFormGroup();

  constructor(
    protected documentAccessEntryService: DocumentAccessEntryService,
    protected documentAccessEntryFormService: DocumentAccessEntryFormService,
    protected documentObjectService: DocumentObjectService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDocumentObject = (o1: IDocumentObject | null, o2: IDocumentObject | null): boolean =>
    this.documentObjectService.compareDocumentObject(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentAccessEntry }) => {
      this.documentAccessEntry = documentAccessEntry;
      if (documentAccessEntry) {
        this.updateForm(documentAccessEntry);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const documentAccessEntry = this.documentAccessEntryFormService.getDocumentAccessEntry(this.editForm);
    if (documentAccessEntry.id !== null) {
      this.subscribeToSaveResponse(this.documentAccessEntryService.update(documentAccessEntry));
    } else {
      this.subscribeToSaveResponse(this.documentAccessEntryService.create(documentAccessEntry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentAccessEntry>>): void {
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

  protected updateForm(documentAccessEntry: IDocumentAccessEntry): void {
    this.documentAccessEntry = documentAccessEntry;
    this.documentAccessEntryFormService.resetForm(this.editForm, documentAccessEntry);

    this.documentObjectsSharedCollection = this.documentObjectService.addDocumentObjectToCollectionIfMissing<IDocumentObject>(
      this.documentObjectsSharedCollection,
      documentAccessEntry.document
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      documentAccessEntry.grantee
    );
  }

  protected loadRelationshipsOptions(): void {
    this.documentObjectService
      .query()
      .pipe(map((res: HttpResponse<IDocumentObject[]>) => res.body ?? []))
      .pipe(
        map((documentObjects: IDocumentObject[]) =>
          this.documentObjectService.addDocumentObjectToCollectionIfMissing<IDocumentObject>(
            documentObjects,
            this.documentAccessEntry?.document
          )
        )
      )
      .subscribe((documentObjects: IDocumentObject[]) => (this.documentObjectsSharedCollection = documentObjects));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.documentAccessEntry?.grantee)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
