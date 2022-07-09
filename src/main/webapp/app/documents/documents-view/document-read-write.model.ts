import dayjs from 'dayjs/esm';
import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';

export interface IDocumentObjectWrite {
  id?: number;
  path?: string;
  name?: string;
  mimeType?: string;
  documentPolicy?: DocumentPolicy;
}

export class DocumentObjectWrite implements IDocumentObjectWrite {
  constructor(
    public id?: number,
    public path?: string,
    public name?: string,
    public mimeType?: string,
    public documentPolicy?: DocumentPolicy
  ) {}
}

export interface IDocumentObjectRead {
  id?: number;
  path?: string;
  name?: string;
  pathUuid?: string;
  nameUuid?: string;
  mimeType?: string | null;
  objectUrl?: string | null;
  objectWriteUrl?: string | null;
  thumbnailUrl?: string | null;
  byteSize?: number | null;
  numberOfPages?: number | null;
  creation?: dayjs.Dayjs | null;
  lastContentModification?: dayjs.Dayjs | null;
  documentPolicy?: DocumentPolicy | null;
  objectKey?: string | null;
  thumbnailKey?: string | null;
}

export class DocumentObjectRead implements IDocumentObjectRead {
  constructor(
    public id?: number,
    public path?: string,
    public name?: string,
    public pathUuid?: string,
    public nameUuid?: string,
    public mimeType?: string | null,
    public objectUrl?: string | null,
    public objectWriteUrl?: string | null,
    public thumbnailUrl?: string | null,
    public byteSize?: number | null,
    public numberOfPages?: number | null,
    public creation?: dayjs.Dayjs | null,
    public lastContentModification?: dayjs.Dayjs | null,
    public documentPolicy?: DocumentPolicy | null,
    public objectKey?: string | null,
    public thumbnailKey?: string | null
  ) {}
}
