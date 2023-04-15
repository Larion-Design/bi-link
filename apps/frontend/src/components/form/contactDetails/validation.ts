import { z } from 'zod'
import { phone } from 'phone'
import {
  validateCustomFieldsFormat,
  validateDuplicateCustomFields,
} from '../customInputFields/validation'
import { CustomField } from 'defs'

export const validateContactDetails = async (contactDetails: CustomField[]) => {
  let error = await validateCustomFieldsFormat(contactDetails)

  if (!error) {
    error = validateDuplicateCustomFields(contactDetails)
  }
  if (!error) {
    error = validateEmailFields(contactDetails)
  }
  if (!error) {
    error = validatePhoneNumberFields(contactDetails)
  }
  return Promise.resolve(error)
}

export const validateEmailFields = (contactDetails: CustomField[]) => {
  const emailValidationSchema = z.string().email()

  for (const { fieldName, fieldValue } of contactDetails) {
    if (fieldName === 'Email' && !emailValidationSchema.parse(fieldValue)) {
      return 'Adresa de email este invalida.'
    }
  }
}

export const validatePhoneNumberFields = (contactDetails: CustomField[]) => {
  for (const { fieldName, fieldValue } of contactDetails) {
    if (
      fieldName === 'Telefon' &&
      !phone(fieldValue, { country: 'RO', validateMobilePrefix: false }).isValid
    ) {
      return 'Numărul de telefon este invalid.'
    }
  }
}
