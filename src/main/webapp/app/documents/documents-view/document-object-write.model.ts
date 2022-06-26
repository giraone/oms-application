import { DocumentPolicy } from 'app/entities/model/enumerations/document-policy.model';

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
