import { validateLocation } from '@frontend/components/form/locations/validation'
import { FormikErrors } from 'formik'
import { validateCNP } from './cnp'
import { validateContactDetails } from '../../../contactDetails/validation'
import { validateCustomFields } from '../../../customInputFields/validation'
import { validateFilesFormat } from '../../../fileField/validation'
import { validateIdDocuments } from '../../idDocuments/validation'
import { validatePersonRelationships } from '../../relationships/validation/validation'
import {
  CustomFieldAPI,
  FileAPIInput,
  IdDocument,
  LocationAPIInput,
  PersonAPIInput,
  RelationshipAPI,
} from 'defs'

export const validatePersonForm = async (values: PersonAPIInput, personId?: string) => {
  const errors: FormikErrors<PersonAPIInput> = {
    images: await personFormValidation.files(values.images),
    files: await personFormValidation.files(values.files),
    relationships: await personFormValidation.relationships(values.relationships),
    contactDetails: await personFormValidation.contactDetails(values.contactDetails),
    documents: await personFormValidation.documents(values.documents, personId),
    customFields: await personFormValidation.customFields(values.customFields),
  }

  for (const fieldName in errors) {
    if (errors[fieldName]) {
      return errors
    }
  }
}

export const personFormValidation = {
  firstName: async (firstName: string) => {
    if (firstName.length && firstName.length < 2) {
      return Promise.resolve('Prenumele trebuie sa contina minim doua litere.')
    }
  },
  lastName: async (lastName: string) => {
    if (lastName.length && lastName.length < 2) {
      return Promise.resolve('Numele trebuie sa contina minim doua litere.')
    }
  },
  homeAddress: async (homeAddress: LocationAPIInput) => {
    if (homeAddress) {
      return validateLocation(homeAddress)
    }
  },
  cnp: async (cnp: string, personId?: string) => validateCNP(cnp, personId),
  birthdate: async (birthdate: Date | string | null) => {
    return Promise.resolve(undefined)
  },
  files: async (files: FileAPIInput[]) => {
    if (files.length) {
      return validateFilesFormat(files)
    }
  },
  relationships: async (relationships: RelationshipAPI[]) => {
    if (relationships.length) {
      return validatePersonRelationships(relationships)
    }
  },
  contactDetails: async (contactDetails: CustomFieldAPI[]) => {
    if (contactDetails.length) {
      return validateContactDetails(contactDetails)
    }
  },
  documents: async (documents: IdDocument[], personId?: string) => {
    if (documents.length) {
      return await validateIdDocuments(documents, personId)
    }
  },
  customFields: async (customFields: CustomFieldAPI[]) => {
    if (customFields.length) {
      return validateCustomFields(customFields)
    }
  },
}
