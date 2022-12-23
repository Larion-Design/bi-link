import { CustomFieldAPI } from '../../../../types/customField'
import { validateCustomFields } from '../../customInputFields/validation'
import { validateFilesFormat, validateSingleFileFormat } from '../../fileField/validation'
import { FileAPIInput } from '../../../../types/file'
import { FormikErrors } from 'formik'
import { vinExists } from '../../../../graphql/properties/queries/vehicles/vinExists'
import { PropertyAPIInput } from '../../../../types/property'
import { PropertyOwnerAPI } from '../../../../types/propertyOwner'

export const validatePropertyForm = async (propertyInfo: PropertyAPIInput, propertyId?: string) => {
  const errors: FormikErrors<PropertyAPIInput> = {
    customFields: await propertyFormValidation.customFields(propertyInfo.customFields),
    files: await propertyFormValidation.files(propertyInfo.files),
  }

  for (const fieldName in errors) {
    if (errors[fieldName]) {
      return errors
    }
  }
}

export const propertyFormValidation = {
  vin: async (vin: string, propertyId?: string) => {
    if (vin.length) {
      return vinExists(vin, propertyId)
    }
  },
  maker: async (value: string) => {
    if (value.length) {
      if (value.length < 3) {
        return Promise.resolve('Numele mărcii este prea scurt.')
      }
    }
  },
  model: async (value: string) => {
    if (value.length) {
      if (value.length < 3) {
        return Promise.resolve('Denumirea modelului este prea scurt.')
      }
    }
  },
  color: async (value: string) => {
    if (value.length) {
      if (value.length < 2) {
        return Promise.resolve('Numele culorii este prea scurt.')
      }
    }
  },
  customFields: async (customFields: CustomFieldAPI[]) => {
    if (customFields.length) {
      return validateCustomFields(customFields)
    }
  },
  image: async (image: FileAPIInput | null) => {
    if (image) {
      return validateSingleFileFormat(image)
    }
  },
  files: async (files: FileAPIInput[]) => {
    if (files.length) {
      return validateFilesFormat(files)
    }
  },
  owners: async (owners: PropertyOwnerAPI[]) => {
    if (owners.length) {
    }
  },
}
