import { Injectable } from '@nestjs/common'
import { CustomFieldModel } from '@app/entities/models/customFieldModel'
import { CustomField } from '../dto/customField'

@Injectable()
export class CustomFieldsService {
  createCustomFieldsModels = (customFields: CustomField[]) =>
    customFields.map((customFieldInfo) => {
      const customFieldModel = new CustomFieldModel()
      customFieldModel.fieldName = customFieldInfo.fieldName
      customFieldModel.fieldValue = customFieldInfo.fieldValue
      return customFieldModel
    })
}
