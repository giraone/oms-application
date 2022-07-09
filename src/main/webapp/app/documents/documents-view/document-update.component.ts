import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { AlertService } from 'app/core/util/alert.service';
import { DocumentObjectService } from 'app/entities/document-object/service/document-object.service';
import { DocumentsService } from './documents.service';
import { IDocumentObjectWrite } from './document-read-write.model';

@Component({
  selector: 'jhi-document-update',
  templateUrl: './document-update.component.html',
})
export class DocumentUpdateComponent implements OnInit {
  documentObject: IDocumentObjectWrite | null = null;
  isSaving = false;
  fileToUpload: File | null = null;
  users: IUser[] | null = null;

  constructor(
    protected alertService: AlertService,
    protected documentObjectService: DocumentObjectService,
    protected documentsService: DocumentsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      this.documentObject = documentObject;
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
    console.log('DocumentUpdateComponent.handleFileInput file=' + JSON.stringify(files));
    this.fileToUpload = files.item(0);
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
    if (!this.fileToUpload || !this.documentObject) {
      return;
    }
    if (!this.fileToUpload.type || this.fileToUpload.type === '') {
      this.documentObject.mimeType = 'application/octet-stream';
    } else {
      this.documentObject.mimeType = this.fileToUpload.type;
    }
    console.log('DocumentUpdateComponent.saveBytes documentObject.mimeType = ' + this.documentObject.mimeType);

    this.documentsService.reservePutUrl(this.documentObject).subscribe(
      data => {
        console.log('DocumentUpdateComponent.save reservePutUrl ' + JSON.stringify(data.body));
        if (!data.body?.objectWriteUrl) {
          this.isSaving = false;
          this.alertService.addAlert({ type: 'warning', message: 'No write URL in response!' });
          return;
        }
        this.documentsService.uploadToS3UsingPut(byteArray, this.documentObject?.mimeType, data.body.objectWriteUrl).subscribe({
          // eslint-disable-next-line @typescript-eslint/ban-types
          next: (httpResponse: HttpResponse<Object>) => {
            const requestId = httpResponse.headers.get('X-Amz-Request-Id');
            console.log(`DocumentUpdateComponent.save uploadToS3UsingPut SUCCESS X-Amz-Request-Id = ${requestId}`);
            this.isSaving = false;
            setTimeout(() => {
              this.previousState();
            }, 1000);
          },
          error: error => {
            this.isSaving = false;
            this.alertService.addAlert({
              type: 'warning',
              message: `ERROR in uploadToS3: ${error}`,
            });
          },
        });
      },
      error => {
        this.isSaving = false;
        this.alertService.addAlert({ type: 'warning', message: `ERROR in reservePutUrl: ${error}` });
      }
    );
  }

  previousState(): void {
    window.history.back();
  }

  protected onError(errorMessage: string): void {
    this.alertService.addAlert({ type: 'warning', message: errorMessage });
  }
}
