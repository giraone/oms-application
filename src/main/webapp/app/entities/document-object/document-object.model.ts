import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';

export interface IDocumentObject {
  id: number;
  path?: string | null;
  name?: string | null;
  pathUuid?: string | null;
  nameUuid?: string | null;
  mimeType?: string | null;
  objectUrl?: string | null;
  thumbnailUrl?: string | null;
  byteSize?: number | null;
  numberOfPages?: number | null;
  creation?: dayjs.Dayjs | null;
  lastContentModification?: dayjs.Dayjs | null;
  documentPolicy?: DocumentPolicy | null;
  owner?: Pick<IUser, 'id'> | null;
}

export type NewDocumentObject = Omit<IDocumentObject, 'id'> & { id: null };
