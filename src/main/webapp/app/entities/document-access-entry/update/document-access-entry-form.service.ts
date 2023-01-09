import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDocumentAccessEntry, NewDocumentAccessEntry } from '../document-access-entry.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDocumentAccessEntry for edit and NewDocumentAccessEntryFormGroupInput for create.
 */
type DocumentAccessEntryFormGroupInput = IDocumentAccessEntry | PartialWithRequiredKeyOf<NewDocumentAccessEntry>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDocumentAccessEntry | NewDocumentAccessEntry> = Omit<T, 'until'> & {
  until?: string | null;
};

type DocumentAccessEntryFormRawValue = FormValueOf<IDocumentAccessEntry>;

type NewDocumentAccessEntryFormRawValue = FormValueOf<NewDocumentAccessEntry>;

type DocumentAccessEntryFormDefaults = Pick<NewDocumentAccessEntry, 'id' | 'until'>;

type DocumentAccessEntryFormGroupContent = {
  id: FormControl<DocumentAccessEntryFormRawValue['id'] | NewDocumentAccessEntry['id']>;
  access: FormControl<DocumentAccessEntryFormRawValue['access']>;
  until: FormControl<DocumentAccessEntryFormRawValue['until']>;
  document: FormControl<DocumentAccessEntryFormRawValue['document']>;
  grantee: FormControl<DocumentAccessEntryFormRawValue['grantee']>;
};

export type DocumentAccessEntryFormGroup = FormGroup<DocumentAccessEntryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DocumentAccessEntryFormService {
  createDocumentAccessEntryFormGroup(documentAccessEntry: DocumentAccessEntryFormGroupInput = { id: null }): DocumentAccessEntryFormGroup {
    const documentAccessEntryRawValue = this.convertDocumentAccessEntryToDocumentAccessEntryRawValue({
      ...this.getFormDefaults(),
      ...documentAccessEntry,
    });
    return new FormGroup<DocumentAccessEntryFormGroupContent>({
      id: new FormControl(
        { value: documentAccessEntryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      access: new FormControl(documentAccessEntryRawValue.access, {
        validators: [Validators.required],
      }),
      until: new FormControl(documentAccessEntryRawValue.until),
      document: new FormControl(documentAccessEntryRawValue.document, {
        validators: [Validators.required],
      }),
      grantee: new FormControl(documentAccessEntryRawValue.grantee, {
        validators: [Validators.required],
      }),
    });
  }

  getDocumentAccessEntry(form: DocumentAccessEntryFormGroup): IDocumentAccessEntry | NewDocumentAccessEntry {
    return this.convertDocumentAccessEntryRawValueToDocumentAccessEntry(
      form.getRawValue() as DocumentAccessEntryFormRawValue | NewDocumentAccessEntryFormRawValue
    );
  }

  resetForm(form: DocumentAccessEntryFormGroup, documentAccessEntry: DocumentAccessEntryFormGroupInput): void {
    const documentAccessEntryRawValue = this.convertDocumentAccessEntryToDocumentAccessEntryRawValue({
      ...this.getFormDefaults(),
      ...documentAccessEntry,
    });
    form.reset(
      {
        ...documentAccessEntryRawValue,
        id: { value: documentAccessEntryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DocumentAccessEntryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      until: currentTime,
    };
  }

  private convertDocumentAccessEntryRawValueToDocumentAccessEntry(
    rawDocumentAccessEntry: DocumentAccessEntryFormRawValue | NewDocumentAccessEntryFormRawValue
  ): IDocumentAccessEntry | NewDocumentAccessEntry {
    return {
      ...rawDocumentAccessEntry,
      until: dayjs(rawDocumentAccessEntry.until, DATE_TIME_FORMAT),
    };
  }

  private convertDocumentAccessEntryToDocumentAccessEntryRawValue(
    documentAccessEntry: IDocumentAccessEntry | (Partial<NewDocumentAccessEntry> & DocumentAccessEntryFormDefaults)
  ): DocumentAccessEntryFormRawValue | PartialWithRequiredKeyOf<NewDocumentAccessEntryFormRawValue> {
    return {
      ...documentAccessEntry,
      until: documentAccessEntry.until ? documentAccessEntry.until.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
