import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

import { IDocumentObjectRead, IDocumentObjectWrite } from './document-read-write.model';

type EntityResponseType = HttpResponse<IDocumentObjectRead>;
type EntityArrayResponseType = HttpResponse<IDocumentObjectRead[]>;

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/documents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDocumentObjectRead>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocumentObjectRead[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  reservePutUrl(documentObject: IDocumentObjectWrite): Observable<EntityResponseType> {
    return this.http.post<IDocumentObjectRead>(this.resourceUrl, documentObject, { observe: 'response' });
  }

  // TODO: Response type
  // eslint-disable-next-line @typescript-eslint/ban-types
  uploadToS3UsingMultipart(fileToUpload: File, targetUrl: string): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http.post(targetUrl, formData);
  }

  /**
   * Upload an object/document to S3 using a pre-signed URL
   * @param bytes The content ot be put in S3
   * @param mimeType The MIME type of the content. If not given application/octet-stream is used.
   * @param targetUrl The S3 pre-signed URL
   * @returns An Observable containing the full HttpResponse. The response will be null, but HTTP headers
   * might be of interest.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  uploadToS3UsingPut(bytes: string | ArrayBuffer, mimeType: string | undefined, targetUrl: string): Observable<HttpResponse<Object>> {
    let httpHeaders = new HttpHeaders();
    if (mimeType == null) {
      mimeType = 'application/octet-stream';
    }
    httpHeaders = httpHeaders.append('content-type', mimeType);
    console.log('uploadToS3UsingPut ' + targetUrl + ' ' + mimeType);
    return this.http.put(targetUrl, bytes, { headers: httpHeaders, observe: 'response' });
  }

  update(documentObject: IDocumentObjectWrite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentObject);
    return this.http
      .put<IDocumentObjectRead>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  maintenanceThumbnails(): Observable<EntityArrayResponseType> {
    return this.http.get<IDocumentObjectRead[]>(SERVER_API_URL + 'api/maintenance/thumbnails', { observe: 'response' });
  }

  protected convertDateFromClient(documentObject: IDocumentObjectRead): IDocumentObjectRead {
    return Object.assign({}, documentObject, {
      creation: documentObject.creation?.isValid() ? documentObject.creation.format(DATE_FORMAT) : undefined,
      lastContentModification: documentObject.lastContentModification?.isValid()
        ? documentObject.lastContentModification.format(DATE_FORMAT)
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creation = res.body.creation != null ? dayjs(res.body.creation) : undefined;
      res.body.lastContentModification = res.body.lastContentModification != null ? dayjs(res.body.lastContentModification) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((documentObject: IDocumentObjectRead) => {
        documentObject.creation = documentObject.creation != null ? dayjs(documentObject.creation) : undefined;
        documentObject.lastContentModification =
          documentObject.lastContentModification != null ? dayjs(documentObject.lastContentModification) : undefined;
      });
    }
    return res;
  }
}
