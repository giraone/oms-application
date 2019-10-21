import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDocumentObject, DocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from '../../entities/document-object/document-object.service';
import { DocumentsService } from './documents.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-documents-upload',
  templateUrl: './documents-upload.component.html'
})
export class DocumentsUploadComponent implements OnInit {
  isSaving: boolean;
  fileToUpload: File = null;
  users: IUser[];

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
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
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
    this.isSaving = true;
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.fileToUpload);
    fileReader.addEventListener("load", () => {
      this.saveBytes(fileReader.result)
    });
  }

  saveBytes(byteArray: string | ArrayBuffer) {

    const documentObject = this.createFromForm();
    if (!this.fileToUpload.type || this.fileToUpload.type === '') {
      documentObject.mimeType = 'application/octet-stream';
    } else {
      documentObject.mimeType = this.fileToUpload.type;
    }
    // eslint-disable-next-line no-console
    console.log('documentObject.mimeType = ' + documentObject.mimeType);

    this.documentsService.reservePostUrl(documentObject)
      .subscribe((data) => {
        // eslint-disable-next-line no-console
        console.log('DocumentsUploadComponent.save reservePostUrl ' + JSON.stringify(data.body));
        this.documentsService.uploadToS3UsingPut(byteArray, documentObject.mimeType, data.body.objectWriteUrl)
          .subscribe((s3Data) => {
            // eslint-disable-next-line no-console
            console.log('DocumentsUploadComponent.save uploadToS3UsingPut ' + s3Data);
            this.isSaving = false;
            setTimeout(() => {
              this.previousState();
            }, 1000);
          }, (error) => {
            this.isSaving = false;
            this.jhiAlertService.error("ERROR in uploadToS3UsingPut: " + error, null, null);
          });
      }, (error) => {
        this.isSaving = false;
        this.jhiAlertService.error("ERROR in reservePostUrl: " + error, null, null);
      });
  }

  updateForm(documentObject: IDocumentObject) {
    this.editForm.patchValue({
      name: documentObject.name
    });
  }

  previousState() {
    window.history.back();
  }


  private createFromForm(): IDocumentObject {
    return {
      ...new DocumentObject(),
      path: '/',
      name: this.editForm.get(['name']).value
    };
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
