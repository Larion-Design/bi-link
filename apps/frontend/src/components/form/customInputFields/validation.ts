import * as yup from 'yup'
import { CustomField } from 'defs'

export const validateCustomFields = async (customFields: CustomField[]) => {
  let error = await validateCustomFieldsFormat(customFields)

  if (!error) {
    error = validateDuplicateCustomFields(customFields)
  }
  return Promise.resolve(error)
}

export const validateDuplicateCustomFields = (customFields: CustomField[]) => {
  const set: string[] = []

  for (const { fieldName, fieldValue } of customFields) {
    const entry = `${fieldName}:${fieldValue}`

    if (set.includes(entry)) {
      return `Ai introdus aceeași valoare de mai multe ori in ${fieldName}.`
    }
    set.push(entry)
  }
}

export const customFieldsValidationSchema = yup.array().of(
  yup.object().shape({
    fieldName: yup.string().required(),
    fieldValue: yup.string().required(),
  }),
)

export const validateCustomFieldsFormat = async (customFields: Array<unknown>) => {
  const isValid = await customFieldsValidationSchema.isValid(customFields)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}
