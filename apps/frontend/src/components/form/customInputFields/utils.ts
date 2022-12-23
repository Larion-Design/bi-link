import { CustomField } from '../../../types/customField'

export const extractCustomFieldValue = (customFields: CustomField[], field: string) => {
  for (const { fieldName, fieldValue } of customFields) {
    if (fieldName === field) {
      return fieldValue
    }
  }
}

export const extractCustomFieldsValues = (
  customFields: CustomField[],
  fields: string[],
) => {
  const extractedFields: Record<string, string> = {}

  customFields.forEach(({ fieldName, fieldValue }) => {
    if (fields.includes(fieldName)) {
      extractedFields[fieldName] = fieldValue
    }
  })

  return extractedFields
}
