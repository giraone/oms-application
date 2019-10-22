import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDocumentObject } from 'app/shared/model/document-object.model';

type EntityResponseType = HttpResponse<IDocumentObject>;
type EntityArrayResponseType = HttpResponse<IDocumentObject[]>;

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  public resourceUrl = SERVER_API_URL + 'api/documents';

  constructor(protected http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocumentObject[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  reservePostUrl(documentObject: IDocumentObject): Observable<EntityResponseType> {
    // TODO: create separate DTO
    documentObject.nameUuid= documentObject.name;
    documentObject.pathUuid= documentObject.path;
    return this.http.post<IDocumentObject>(this.resourceUrl, documentObject, { observe: 'response' });
  }

  // TODO: Response type
  uploadToS3UsingMultipart(fileToUpload: File, targetUrl: string): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(targetUrl, formData);
  }

  /**
   * Upload an object/document to S3 using a pre-signed URL
   * @param bytes The content ot be put in S3
   * @param mimeType The MIME type of the content
   * @param targetUrl The S3 pre-signed URL
   * @returns An Observable containing the full HttpResponse. The response will be null, but HTTP headers
   * might be of interest.
   */
  uploadToS3UsingPut(bytes: string | ArrayBuffer, mimeType: string, targetUrl: string): Observable<HttpResponse<Object>> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('content-type', mimeType);
    // eslint-disable-next-line no-console
    console.log('uploadToS3UsingPut ' + targetUrl + ' ' + mimeType);
    return this.http
      .put(targetUrl, bytes, { headers : httpHeaders, observe: 'response'});
  }

  update(documentObject: IDocumentObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .put<IDocumentObject>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  maintenanceThumbnails(req?: any): Observable<EntityArrayResponseType> {
    return this.http.get<IDocumentObject[]>(SERVER_API_URL + 'api/maintenance/thumbnails', { observe: 'response' });
  }


  protected convertDateFromClient(documentObject: IDocumentObject): IDocumentObject {
    const copy: IDocumentObject = Object.assign({}, documentObject, {
      creation: documentObject.creation != null && documentObject.creation.isValid() ? documentObject.creation.toJSON() : null,
      lastContentModification:
        documentObject.lastContentModification != null && documentObject.lastContentModification.isValid()
          ? documentObject.lastContentModification.toJSON()
          : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creation = res.body.creation != null ? moment(res.body.creation) : null;
      res.body.lastContentModification = res.body.lastContentModification != null ? moment(res.body.lastContentModification) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((documentObject: IDocumentObject) => {
        documentObject.creation = documentObject.creation != null ? moment(documentObject.creation) : null;
        documentObject.lastContentModification =
          documentObject.lastContentModification != null ? moment(documentObject.lastContentModification) : null;
      });
    }
    return res;
  }
}
