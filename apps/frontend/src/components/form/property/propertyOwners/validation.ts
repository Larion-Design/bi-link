import * as yup from 'yup'
import {
  customFieldsValidationSchema,
  validateDuplicateCustomFields,
} from '../../customInputFields/validation'
import { PropertyOwnerAPI } from 'defs'

const ownersSchemaValidation = yup
  .array()
  .optional()
  .of(
    yup.object().shape({
      person: yup.object().shape({
        _id: yup.string(),
      }),
      company: yup.object().shape({
        _id: yup.string(),
      }),
      registrationNumber: yup.string().required(),
      startDate: yup.date().optional().nullable(),
      endDate: yup.date().optional().nullable(),
      customFields: customFieldsValidationSchema,
    }),
  )

export const validateOwners = async (owners: PropertyOwnerAPI[]) => {
  let error = await validateOwnersDataStructure(owners)

  if (!error) {
    for (const { customFields } of owners) {
      error = validateDuplicateCustomFields(customFields)

      if (error) {
        return error
      }
    }
  }
  return error
}

export const validateOwnersDataStructure = async (owners: unknown) => {
  const isValid = await ownersSchemaValidation.isValid(owners)

  if (!isValid) {
    return 'Formatul informatiilor despre proprietari nu este corect.'
  }
}
