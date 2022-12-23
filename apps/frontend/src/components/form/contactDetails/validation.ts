import { phone } from 'phone'
import * as yup from 'yup'
import {
  validateCustomFieldsFormat,
  validateDuplicateCustomFields,
} from '../customInputFields/validation'
import { CustomField } from '../../../types/customField'

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
  const emailValidationSchema = yup.string().email()

  for (const { fieldName, fieldValue } of contactDetails) {
    if (
      fieldName === 'Email' &&
      !emailValidationSchema.isValidSync(fieldValue)
    ) {
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
