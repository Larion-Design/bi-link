import { FormikErrors } from 'formik'
import * as yup from 'yup'
import { validateCNP } from './cnp'
import { validateContactDetails } from '../../contactDetails/validation'
import { validateCustomFields } from '../../customInputFields/validation'
import { validateFilesFormat } from '../../fileField/validation'
import { validateIdDocuments } from '../../idDocuments/validation'
import { validatePersonRelationships } from '../../relationships/validation/validation'
import {
  CustomFieldAPI,
  FileAPIInput,
  IdDocument,
  PersonAPIInput,
  RelationshipAPIInput,
} from 'defs'

export const validatePersonForm = async (values: PersonAPIInput, personId?: string) => {
  const errors: FormikErrors<PersonAPIInput> = {
    firstName: await personFormValidation.firstName(values.firstName),
    lastName: await personFormValidation.lastName(values.lastName),
    oldName: await personFormValidation.oldName(values.oldName),
    homeAddress: await personFormValidation.homeAddress(values.homeAddress),
    cnp: await personFormValidation.cnp(values.cnp, personId),
    birthdate: await personFormValidation.birthdate(values.birthdate),
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
  oldName: async (oldName: string) => {
    if (oldName.length && oldName.length < 2) {
      return Promise.resolve('Numele trebuie sa contina minim doua litere.')
    }
  },
  homeAddress: async (homeAddress: string) => {
    if (homeAddress.length && homeAddress.length < 3) {
      return Promise.resolve('Adresa este prea scurta.')
    }
  },
  cnp: async (cnp: string, personId?: string) => validateCNP(cnp, personId),
  birthdate: async (birthdate: Date | string | null) => {
    const isValid = await yup.date().optional().nullable().isValid(birthdate)

    if (!isValid) {
      return Promise.resolve('Data nasterii este invalida.')
    }
  },
  files: async (files: FileAPIInput[]) => {
    if (files.length) {
      return validateFilesFormat(files)
    }
  },
  relationships: async (relationships: RelationshipAPIInput[]) => {
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
