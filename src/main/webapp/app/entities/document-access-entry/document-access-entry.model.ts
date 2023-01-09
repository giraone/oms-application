import dayjs from 'dayjs/esm';
import { IDocumentObject } from 'app/entities/document-object/document-object.model';
import { IUser } from 'app/entities/user/user.model';
import { AccessType } from 'app/entities/enumerations/access-type.model';

export interface IDocumentAccessEntry {
  id: number;
  access?: AccessType | null;
  until?: dayjs.Dayjs | null;
  document?: Pick<IDocumentObject, 'id'> | null;
  grantee?: Pick<IUser, 'id'> | null;
}

export type NewDocumentAccessEntry = Omit<IDocumentAccessEntry, 'id'> & { id: null };
