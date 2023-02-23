import { FormikErrors } from 'formik'
import { validateContactDetails } from '../../contactDetails/validation'
import { validateCustomFields } from '../../customInputFields/validation'
import { validateFilesFormat } from '../../fileField/validation'
import { validateAssociates } from '../../associates/validation'
import { validateLocations } from '../../locations/validation'
import { validateCompanyName } from './name'
import { validateCompanyCUI } from './cui'
import { validateHeadquarters } from './headquarters'
import { validateRegistrationNumber } from './registrationNumber'
import { AssociateAPIInput, CompanyAPIInput, CustomFieldAPI, FileAPIInput, Location } from 'defs'

export const validateCompanyForm = async (values: CompanyAPIInput, companyId?: string) => {
  const errors: FormikErrors<CompanyAPIInput> = {
    name: await companyFormValidation.name(values.name),
    cui: await companyFormValidation.cui(values.cui, companyId),
    headquarters: await companyFormValidation.headquarters(values.headquarters),
    registrationNumber: await companyFormValidation.registrationNumber(
      values.registrationNumber,
      companyId,
    ),
    files: await companyFormValidation.files(values.files),
    contactDetails: await companyFormValidation.contactDetails(values.contactDetails),
    customFields: await companyFormValidation.customFields(values.customFields),
  }

  for (const fieldName in errors) {
    if (errors[fieldName]) {
      return errors
    }
  }
}

export const companyFormValidation = {
  name: validateCompanyName,
  cui: validateCompanyCUI,
  headquarters: validateLocations(),
  registrationNumber: validateRegistrationNumber,
  contactDetails: async (contactDetails: CustomFieldAPI[]) => {
    if (contactDetails.length) {
      return validateContactDetails(contactDetails)
    }
  },
  customFields: async (customFields: CustomFieldAPI[]) => {
    if (customFields.length) {
      return validateCustomFields(customFields)
    }
  },
  files: async (files: FileAPIInput[]) => {
    if (files.length) {
      return validateFilesFormat(files)
    }
  },
  associates: async (associates: AssociateAPIInput[]) => {
    if (associates.length) {
      return validateAssociates(associates)
    }
  },
  locations: async (locations: Location[]) => {
    if (locations.length) {
      return validateLocations(locations)
    }
  },
}
