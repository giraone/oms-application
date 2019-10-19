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
    this.editForm.patchValue({
      name: this.fileToUpload.name
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

    this.documentsService.reservePostUrl(documentObject)
      .subscribe((data) => {
        // eslint-disable-next-line no-console
        console.log('DocumentsUploadComponent.save reservePostUrl ' + data.body);
        this.documentsService.uploadToS3UsingPut(byteArray, data.body.objectUrl)
          .subscribe((s3Data) => {
            // eslint-disable-next-line no-console
            console.log('DocumentsUploadComponent.save uploadToS3 ' + s3Data);
            this.isSaving = false;
          }, (error) => {
            this.isSaving = false;
            this.jhiAlertService.error("ERROR in uploadToS3: " + error, null, null);
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
