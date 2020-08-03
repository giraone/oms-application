import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDocumentObject, DocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from '../../entities/document-object/document-object.service';
import { DocumentsService } from './documents.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IDocumentObjectWrite, DocumentObjectWrite } from './document-object-write.model';

@Component({
  selector: 'jhi-documents-upload',
  templateUrl: './documents-upload.component.html'
})
export class DocumentsUploadComponent implements OnInit {
  isSaving = false;
  fileToUpload: File|null = null;
  users: IUser[]|null = null;

  editForm = this.fb.group({
    name: [null, [Validators.required]]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected documentObjectService: DocumentObjectService,
    protected documentsService: DocumentsService,
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
      .subscribe(
        (res: IUser[]|null) => this.users = res,
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  handleFileInput(event: any) { // any instead of Event, because of files does not exist in TS

    const files: FileList = event?.target?.files;
    console.log('DocumentsUploadComponent.handleFileInput file=' + JSON.stringify(files));
    this.fileToUpload = files?.item(0);
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
      name: documentName
    });
  }

  save() {
    if (!this.fileToUpload) {
      return;
    }
    this.isSaving = true;
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.fileToUpload);
    fileReader.addEventListener("load", () => {
      fileReader.result && this.saveBytes(fileReader.result)
    });
  }

  saveBytes(byteArray: string | ArrayBuffer) {

    if (!this.fileToUpload) {
      return;
    }
    const documentObject = this.createFromForm();
    if (!this.fileToUpload.type || this.fileToUpload.type === '') {
      documentObject.mimeType = 'application/octet-stream';
    } else {
      documentObject.mimeType = this.fileToUpload.type;
    }

    this.documentsService.reservePutUrl(documentObject)
      .subscribe((data) => {

        console.log('DocumentsUploadComponent.save reservePutUrl ' + JSON.stringify(data.body));
        if (!data.body?.objectWriteUrl) {
          this.isSaving = false;
          this.jhiAlertService.error("No write URL in response: ", null);
          return;
        }
        this.documentsService.uploadToS3UsingPut(byteArray, documentObject.mimeType, data.body.objectWriteUrl)
          .subscribe((httpResponse : HttpResponse<Object>) => {

            console.log('DocumentsUploadComponent.save uploadToS3UsingPut SUCCESS X-Amz-Request-Id=' + httpResponse.headers.get('X-Amz-Request-Id'));
            this.isSaving = false;
            setTimeout(() => {
              this.previousState();
            }, 0);
          }, (error) => {
            this.isSaving = false;
            this.jhiAlertService.error("ERROR in uploadToS3UsingPut: " + error, null);
          });
      }, (error) => {
        this.isSaving = false;
        this.jhiAlertService.error("ERROR in reservePutUrl: " + error, null);
      });
  }

  updateForm(documentObject: IDocumentObjectWrite) {
    this.editForm.patchValue({
      name: documentObject.name
    });
  }

  previousState() {
    window.history.back();
  }


  private createFromForm(): IDocumentObjectWrite {
    const nameControl = this.editForm.get(['name']);
    return {
      ...new DocumentObjectWrite(),
      path: '/',
      name: nameControl ? nameControl.value : 'newDocument'
    };
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
