export interface IDocumentObject {
  id?: number;
  path?: string;
  name?: string;
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
    public mimeType?: string,
    public objectUrl?: string,
    public thumbnailUrl?: string,
    public byteSize?: number,
    public numberOfPages?: number,
    public ownerId?: number
  ) {}
}
