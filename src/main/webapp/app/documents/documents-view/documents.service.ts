import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post<IDocumentObject>(this.resourceUrl, documentObject, { observe: 'response' });
  }

  // TODO: Response type
  uploadToS3UsingMultipart(fileToUpload: File, targetUrl: string): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(targetUrl, formData);
  }

  uploadToS3UsingPut(bytes: string | ArrayBuffer, targetUrl: string): Observable<Object> {
    return this.http
      .put(targetUrl, bytes);
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
