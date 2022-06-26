import { Dayjs } from 'dayjs';
import { AccessType } from './enumerations/access-type.model';

export interface IDocumentAccessEntry {
  id?: number;
  access?: AccessType;
  until?: Dayjs;
  documentId?: number;
  granteeId?: number;
}

export class DocumentAccessEntry implements IDocumentAccessEntry {
  constructor(
    public id?: number,
    public access?: AccessType,
    public until?: Dayjs,
    public documentId?: number,
    public granteeId?: number
  ) {}
}
