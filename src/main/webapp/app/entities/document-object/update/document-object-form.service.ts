import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDocumentObject, NewDocumentObject } from '../document-object.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDocumentObject for edit and NewDocumentObjectFormGroupInput for create.
 */
type DocumentObjectFormGroupInput = IDocumentObject | PartialWithRequiredKeyOf<NewDocumentObject>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDocumentObject | NewDocumentObject> = Omit<T, 'creation' | 'lastContentModification'> & {
  creation?: string | null;
  lastContentModification?: string | null;
};

type DocumentObjectFormRawValue = FormValueOf<IDocumentObject>;

type NewDocumentObjectFormRawValue = FormValueOf<NewDocumentObject>;

type DocumentObjectFormDefaults = Pick<NewDocumentObject, 'id' | 'creation' | 'lastContentModification'>;

type DocumentObjectFormGroupContent = {
  id: FormControl<DocumentObjectFormRawValue['id'] | NewDocumentObject['id']>;
  path: FormControl<DocumentObjectFormRawValue['path']>;
  name: FormControl<DocumentObjectFormRawValue['name']>;
  pathUuid: FormControl<DocumentObjectFormRawValue['pathUuid']>;
  nameUuid: FormControl<DocumentObjectFormRawValue['nameUuid']>;
  mimeType: FormControl<DocumentObjectFormRawValue['mimeType']>;
  objectUrl: FormControl<DocumentObjectFormRawValue['objectUrl']>;
  thumbnailUrl: FormControl<DocumentObjectFormRawValue['thumbnailUrl']>;
  byteSize: FormControl<DocumentObjectFormRawValue['byteSize']>;
  numberOfPages: FormControl<DocumentObjectFormRawValue['numberOfPages']>;
  creation: FormControl<DocumentObjectFormRawValue['creation']>;
  lastContentModification: FormControl<DocumentObjectFormRawValue['lastContentModification']>;
  documentPolicy: FormControl<DocumentObjectFormRawValue['documentPolicy']>;
  owner: FormControl<DocumentObjectFormRawValue['owner']>;
};

export type DocumentObjectFormGroup = FormGroup<DocumentObjectFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DocumentObjectFormService {
  createDocumentObjectFormGroup(documentObject: DocumentObjectFormGroupInput = { id: null }): DocumentObjectFormGroup {
    const documentObjectRawValue = this.convertDocumentObjectToDocumentObjectRawValue({
      ...this.getFormDefaults(),
      ...documentObject,
    });
    return new FormGroup<DocumentObjectFormGroupContent>({
      id: new FormControl(
        { value: documentObjectRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      path: new FormControl(documentObjectRawValue.path, {
        validators: [Validators.required],
      }),
      name: new FormControl(documentObjectRawValue.name, {
        validators: [Validators.required],
      }),
      pathUuid: new FormControl(documentObjectRawValue.pathUuid, {
        validators: [Validators.required],
      }),
      nameUuid: new FormControl(documentObjectRawValue.nameUuid, {
        validators: [Validators.required],
      }),
      mimeType: new FormControl(documentObjectRawValue.mimeType),
      objectUrl: new FormControl(documentObjectRawValue.objectUrl, {
        validators: [Validators.maxLength(1024)],
      }),
      thumbnailUrl: new FormControl(documentObjectRawValue.thumbnailUrl, {
        validators: [Validators.maxLength(1024)],
      }),
      byteSize: new FormControl(documentObjectRawValue.byteSize),
      numberOfPages: new FormControl(documentObjectRawValue.numberOfPages),
      creation: new FormControl(documentObjectRawValue.creation),
      lastContentModification: new FormControl(documentObjectRawValue.lastContentModification),
      documentPolicy: new FormControl(documentObjectRawValue.documentPolicy),
      owner: new FormControl(documentObjectRawValue.owner, {
        validators: [Validators.required],
      }),
    });
  }

  getDocumentObject(form: DocumentObjectFormGroup): IDocumentObject | NewDocumentObject {
    return this.convertDocumentObjectRawValueToDocumentObject(
      form.getRawValue() as DocumentObjectFormRawValue | NewDocumentObjectFormRawValue
    );
  }

  resetForm(form: DocumentObjectFormGroup, documentObject: DocumentObjectFormGroupInput): void {
    const documentObjectRawValue = this.convertDocumentObjectToDocumentObjectRawValue({ ...this.getFormDefaults(), ...documentObject });
    form.reset(
      {
        ...documentObjectRawValue,
        id: { value: documentObjectRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DocumentObjectFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      creation: currentTime,
      lastContentModification: currentTime,
    };
  }

  private convertDocumentObjectRawValueToDocumentObject(
    rawDocumentObject: DocumentObjectFormRawValue | NewDocumentObjectFormRawValue
  ): IDocumentObject | NewDocumentObject {
    return {
      ...rawDocumentObject,
      creation: dayjs(rawDocumentObject.creation, DATE_TIME_FORMAT),
      lastContentModification: dayjs(rawDocumentObject.lastContentModification, DATE_TIME_FORMAT),
    };
  }

  private convertDocumentObjectToDocumentObjectRawValue(
    documentObject: IDocumentObject | (Partial<NewDocumentObject> & DocumentObjectFormDefaults)
  ): DocumentObjectFormRawValue | PartialWithRequiredKeyOf<NewDocumentObjectFormRawValue> {
    return {
      ...documentObject,
      creation: documentObject.creation ? documentObject.creation.format(DATE_TIME_FORMAT) : undefined,
      lastContentModification: documentObject.lastContentModification
        ? documentObject.lastContentModification.format(DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
