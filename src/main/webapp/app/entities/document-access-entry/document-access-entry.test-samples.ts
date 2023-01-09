import dayjs from 'dayjs/esm';

import { AccessType } from 'app/entities/enumerations/access-type.model';

import { IDocumentAccessEntry, NewDocumentAccessEntry } from './document-access-entry.model';

export const sampleWithRequiredData: IDocumentAccessEntry = {
  id: 17852,
  access: AccessType['CHANGE_CONTENT'],
};

export const sampleWithPartialData: IDocumentAccessEntry = {
  id: 40969,
  access: AccessType['CHANGE_CONTENT'],
};

export const sampleWithFullData: IDocumentAccessEntry = {
  id: 72534,
  access: AccessType['CHANGE_CONTENT'],
  until: dayjs('2023-01-08T14:28'),
};

export const sampleWithNewData: NewDocumentAccessEntry = {
  access: AccessType['READ_METADATA'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
