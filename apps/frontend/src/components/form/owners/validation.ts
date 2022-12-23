import * as yup from 'yup'
import {
  customFieldsValidationSchema,
  validateDuplicateCustomFields,
} from '../customInputFields/validation'
import { OwnerAPIInput } from '../../../types/owner'

const ownersSchemaValidation = yup
  .array()
  .optional()
  .of(
    yup.object().shape({
      person: yup.object().optional().shape({
        _id: yup.string().required(),
      }),
      company: yup.object().optional().shape({
        _id: yup.string().required(),
      }),
      registrationNumber: yup.string().required(),
      startDate: yup.date().optional().nullable(),
      endDate: yup.date().optional().nullable(),
      customFields: customFieldsValidationSchema,
    }),
  )

export const validateOwners = async (owners: OwnerAPIInput[]) => {
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
