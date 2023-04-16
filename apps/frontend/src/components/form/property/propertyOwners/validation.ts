import { validateDuplicateCustomFields } from '../../customInputFields/validation'
import { PropertyOwnerAPI, propertyOwnerAPISchema } from 'defs'

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
  const isValid = await propertyOwnerAPISchema.parseAsync(owners)

  if (!isValid) {
    return 'Formatul informatiilor despre proprietari nu este corect.'
  }
}
