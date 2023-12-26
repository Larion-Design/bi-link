import { Injectable } from '@nestjs/common';
import { CustomField } from 'defs';
import { CustomFieldIndex } from '@modules/definitions';

@Injectable()
export class CustomFieldsIndexerService {
  createCustomFieldIndex = ({
    fieldName,
    fieldValue,
  }: CustomField): CustomFieldIndex => ({
    fieldName,
    fieldValue,
  });

  createCustomFieldsIndex = (customFields: CustomField[]) =>
    customFields.map(this.createCustomFieldIndex);
}
