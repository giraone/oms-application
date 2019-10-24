import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDocumentObject } from 'app/shared/model/document-object.model';
import { DocumentObjectService } from '../../entities/document-object/document-object.service';
import { DocumentsService } from './documents.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-document-update',
  templateUrl: './document-update.component.html'
})
export class DocumentUpdateComponent implements OnInit {

  documentObject: IDocumentObject;
  isSaving: boolean;
  fileToUpload: File = null;
  users: IUser[];

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected documentObjectService: DocumentObjectService,
    protected documentsService: DocumentsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ documentObject }) => {
      this.documentObject = documentObject;
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

    if (!this.fileToUpload.type || this.fileToUpload.type === '') {
      this.documentObject.mimeType = 'application/octet-stream';
    } else {
      this.documentObject.mimeType = this.fileToUpload.type;
    }

    console.log('documentObject.mimeType = ' + this.documentObject.mimeType);

    this.documentsService.reservePostUrl(this.documentObject)
      .subscribe((data) => {

        console.log('DocumentUpdateComponent.save reservePostUrl ' + data.body);
        this.documentsService.uploadToS3UsingPut(byteArray, this.documentObject.mimeType, data.body.objectWriteUrl)
          .subscribe((httpResponse : HttpResponse<Object>) => {

            console.log('DocumentUpdateComponent.save uploadToS3UsingPut SUCCESS X-Amz-Request-Id=' + httpResponse.headers.get('X-Amz-Request-Id'));
            this.isSaving = false;
            setTimeout(() => {
              this.previousState();
            }, 1000);
          }, (error) => {
            this.isSaving = false;
            this.jhiAlertService.error("ERROR in uploadToS3: " + error, null, null);
          });
      }, (error) => {
        this.isSaving = false;
        this.jhiAlertService.error("ERROR in reservePostUrl: " + error, null, null);
      });
  }

  previousState() {
    window.history.back();
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
