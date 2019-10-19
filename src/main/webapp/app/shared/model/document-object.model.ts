export interface IDocumentObject {
  id?: number;
  path?: string;
  name?: string;
  pathUuid?: string;
  nameUuid?: string;
  mimeType?: string;
  objectUrl?: string;
  thumbnailUrl?: string;
  byteSize?: number;
  numberOfPages?: number;
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
    public thumbnailUrl?: string,
    public byteSize?: number,
    public numberOfPages?: number,
    public ownerId?: number
  ) {}
}
