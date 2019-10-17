import { Moment } from 'moment';
import { AccessType } from 'app/shared/model/enumerations/access-type.model';

export interface IDocumentAccessEntry {
  id?: number;
  access?: AccessType;
  until?: Moment;
  documentId?: number;
  granteeId?: number;
}

export class DocumentAccessEntry implements IDocumentAccessEntry {
  constructor(
    public id?: number,
    public access?: AccessType,
    public until?: Moment,
    public documentId?: number,
    public granteeId?: number
  ) {}
}
