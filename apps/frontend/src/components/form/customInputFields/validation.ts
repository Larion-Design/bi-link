import { CustomFieldAPI, customFieldSchema } from 'defs'

export const validateCustomFields = async (customFields: CustomFieldAPI[]) => {
  let error = await validateCustomFieldsFormat(customFields)

  if (!error) {
    error = validateDuplicateCustomFields(customFields)
  }
  return Promise.resolve(error)
}

export const validateDuplicateCustomFields = (customFields: CustomFieldAPI[]) => {
  const set: string[] = []

  for (const { fieldName, fieldValue } of customFields) {
    const entry = `${fieldName}:${fieldValue}`

    if (set.includes(entry)) {
      return `Ai introdus aceeași valoare de mai multe ori in ${fieldName}.`
    }
    set.push(entry)
  }
}

export const validateCustomFieldsFormat = async (customFields: Array<unknown>) => {
  const isValid = await customFieldSchema.array().parseAsync(customFields)

  if (!isValid) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}
