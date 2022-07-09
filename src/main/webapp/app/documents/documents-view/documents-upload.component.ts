import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { DocumentObjectService } from 'app/entities/document-object/service/document-object.service';
import { DocumentsService } from './documents.service';
import { IDocumentObjectWrite, DocumentObjectWrite } from './document-read-write.model';
import { IUser } from 'app/entities/user/user.model';
import { AlertService } from 'app/core/util/alert.service';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-documents-upload',
  templateUrl: './documents-upload.component.html',
})
export class DocumentsUploadComponent implements OnInit {
  isSaving = false;
  fileToUpload: File | null = null;
  users: IUser[] | null = null;

  editForm = this.fb.group({
    name: [null, [Validators.required]],
  });

  constructor(
    protected alertService: AlertService,
    protected documentObjectService: DocumentObjectService,
    protected documentsService: DocumentsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
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
      .subscribe(
        (res: IUser[] | null) => (this.users = res),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  handleFileInput(event: any): void {
    // any instead of Event, because of files does not exist in TS

    const files: FileList = event?.target?.files;
    console.log('DocumentsUploadComponent.handleFileInput file=' + JSON.stringify(files));
    this.fileToUpload = files.item(0);
    if (!this.fileToUpload) {
      return;
    }
    let documentName = this.fileToUpload.name;
    const index = documentName.lastIndexOf('.');
    if (index > 0) {
      documentName = documentName.substring(0, index);
    }
    documentName = documentName.replace(/_/g, ' ');
    this.editForm.patchValue({
      name: documentName,
    });
  }

  save(): void {
    if (!this.fileToUpload) {
      return;
    }
    this.isSaving = true;
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.fileToUpload);
    fileReader.addEventListener('load', () => {
      fileReader.result && this.saveBytes(fileReader.result);
    });
  }

  saveBytes(byteArray: string | ArrayBuffer): void {
    if (!this.fileToUpload) {
      return;
    }
    const documentObject = this.createFromForm();
    if (!this.fileToUpload.type || this.fileToUpload.type === '') {
      documentObject.mimeType = 'application/octet-stream';
    } else {
      documentObject.mimeType = this.fileToUpload.type;
    }

    this.documentsService.reservePutUrl(documentObject).subscribe({
      next: data => {
        console.log('DocumentsUploadComponent.save reservePutUrl ' + JSON.stringify(data.body));
        if (!data.body?.objectWriteUrl) {
          this.isSaving = false;
          this.alertService.addAlert({ type: 'warning', message: 'No write URL in response!' });
          return;
        }
        this.documentsService.uploadToS3UsingPut(byteArray, documentObject.mimeType, data.body.objectWriteUrl).subscribe({
          // eslint-disable-next-line @typescript-eslint/ban-types
          next: (httpResponse: HttpResponse<Object>) => {
            const requestId = httpResponse.headers.get('X-Amz-Request-Id');
            console.log(`DocumentsUploadComponent.save uploadToS3UsingPut SUCCESS X-Amz-Request-Id=${requestId}`);
            this.isSaving = false;
            setTimeout(() => {
              this.previousState();
            }, 0);
          },
          error: error => {
            this.isSaving = false;
            this.alertService.addAlert({ type: 'warning', message: `ERROR in uploadToS3UsingPut: ${error}` });
          },
        });
      },
      error: error => {
        this.isSaving = false;
        this.alertService.addAlert({ type: 'warning', message: `ERROR in reservePutUrl: ${error}` });
      },
    });
  }

  updateForm(documentObject: IDocumentObjectWrite): void {
    this.editForm.patchValue({
      name: documentObject.name,
    });
  }

  previousState(): void {
    window.history.back();
  }

  trackUserById(index: number, item: IUser): number | undefined {
    return item.id;
  }

  protected onError(errorMessage: string): void {
    this.alertService.addAlert({ type: 'warning', message: errorMessage });
  }

  private createFromForm(): IDocumentObjectWrite {
    const nameControl = this.editForm.get(['name']);
    return {
      ...new DocumentObjectWrite(),
      path: '/',
      name: nameControl ? nameControl.value : 'newDocument',
    };
  }
}
