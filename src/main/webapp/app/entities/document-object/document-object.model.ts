import dayjs from 'dayjs/esm';
import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';

export interface IDocumentObject {
  id?: number;
  path?: string;
  name?: string;
  pathUuid?: string;
  nameUuid?: string;
  mimeType?: string | null;
  objectUrl?: string | null;
  thumbnailUrl?: string | null;
  byteSize?: number | null;
  numberOfPages?: number | null;
  creation?: dayjs.Dayjs | null;
  lastContentModification?: dayjs.Dayjs | null;
  documentPolicy?: DocumentPolicy | null;
}

export class DocumentObject implements IDocumentObject {
  constructor(
    public id?: number,
    public path?: string,
    public name?: string,
    public pathUuid?: string,
    public nameUuid?: string,
    public mimeType?: string | null,
    public objectUrl?: string | null,
    public thumbnailUrl?: string | null,
    public byteSize?: number | null,
    public numberOfPages?: number | null,
    public creation?: dayjs.Dayjs | null,
    public lastContentModification?: dayjs.Dayjs | null,
    public documentPolicy?: DocumentPolicy | null
  ) {}
}

export function getDocumentObjectIdentifier(documentObject: IDocumentObject): number | undefined {
  return documentObject.id;
}
