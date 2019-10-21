import { Moment } from 'moment';
import { DocumentPolicy } from 'app/shared/model/enumerations/document-policy.model';

export interface IDocumentObject {
  id?: number;
  path?: string;
  name?: string;
  pathUuid?: string;
  nameUuid?: string;
  mimeType?: string;
  objectUrl?: string;
  objectWriteUrl?: string;
  thumbnailUrl?: string;
  byteSize?: number;
  numberOfPages?: number;
  creation?: Moment;
  lastContentModification?: Moment;
  documentPolicy?: DocumentPolicy;
  ownerId?: number;
}

export class DocumentObject implements IDocumentObject {
  constructor(
    public id?: number,
    public path?: string,
    public name?: string,
    public pathUuid?: string,
    public nameUuid?: string,
    public mimeType?: string,
    public objectUrl?: string,
    public objectWriteUrl?: string,
    public thumbnailUrl?: string,
    public byteSize?: number,
    public numberOfPages?: number,
    public creation?: Moment,
    public lastContentModification?: Moment,
    public documentPolicy?: DocumentPolicy,
    public ownerId?: number
  ) {}
}
