import { getDefaultLocation } from '@frontend/components/form/location'
import { CompanyAPIInput } from 'defs'

export const getDefaultCompany = (): CompanyAPIInput => ({
  name: '',
  cui: '',
  registrationNumber: '',
  headquarters: getDefaultLocation(),
  locations: [],
  files: [],
  associates: [],
  contactDetails: [],
  customFields: [],
})
