import { Injectable } from '@nestjs/common'
import { CustomField } from 'defs'
import { CustomFieldModel } from '../models/customFieldModel'

@Injectable()
export class CustomFieldsService {
  createCustomFieldsModels = (customFields: CustomField[]) =>
    customFields.map((customFieldInfo) => {
      const customFieldModel = new CustomFieldModel()
      customFieldModel.fieldName = customFieldInfo.fieldName
      customFieldModel.fieldValue = customFieldInfo.fieldValue
      customFieldModel.metadata = customFieldInfo.metadata
      return customFieldModel
    })
}
