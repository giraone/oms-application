import dayjs from 'dayjs/esm';

import { DocumentPolicy } from 'app/entities/enumerations/document-policy.model';

import { IDocumentObject, NewDocumentObject } from './document-object.model';

export const sampleWithRequiredData: IDocumentObject = {
  id: 17848,
  path: 'Handcrafted Convertible Generic',
  name: 'Representative',
  pathUuid: 'Associate',
  nameUuid: 'invoice Avon violet',
};

export const sampleWithPartialData: IDocumentObject = {
  id: 61983,
  path: 'Crescent Berkshire circuit',
  name: 'Supervisor online transparent',
  pathUuid: 'Regional driver Bahrain',
  nameUuid: 'circuit',
  mimeType: 'Lebanese',
  thumbnailUrl: 'haptic Small Incredible',
  byteSize: 8415,
  creation: dayjs('2023-01-08T02:21'),
  documentPolicy: DocumentPolicy['LOCKED'],
};

export const sampleWithFullData: IDocumentObject = {
  id: 37594,
  path: 'Data',
  name: 'digital Gloves',
  pathUuid: 'auxiliary',
  nameUuid: 'Lodge Chair Realigned',
  mimeType: 'Rubber',
  objectUrl: 'cyan Specialist Vista',
  thumbnailUrl: 'quantifying e-services',
  byteSize: 1363,
  numberOfPages: 74100,
  creation: dayjs('2023-01-08T01:21'),
  lastContentModification: dayjs('2023-01-08T15:46'),
  documentPolicy: DocumentPolicy['PRIVATE'],
};

export const sampleWithNewData: NewDocumentObject = {
  path: 'redefine',
  name: 'magenta support',
  pathUuid: 'niches system',
  nameUuid: 'Ranch',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
