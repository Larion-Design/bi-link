import { AssociateAPI, CompanyAPIInput } from 'defs'
import { getDefaultLocation } from './location'
import { getDefaultMetadata } from './metadata'
import {
  getDefaultBooleanWithMetadata,
  getDefaultNumberWithMetadata,
  getDefaultOptionalDateWithMetadata,
  getDefaultTextWithMetadata,
} from './valueWithMetadata'

export const getDefaultCompany = (): CompanyAPIInput => ({
  metadata: getDefaultMetadata(),
  name: getDefaultTextWithMetadata(),
  cui: getDefaultTextWithMetadata(),
  registrationNumber: getDefaultTextWithMetadata(),
  headquarters: getDefaultLocation(),
  associates: [],
  contactDetails: [],
  customFields: [],
  locations: [],
  files: [],
})

export const getDefaultAssociate = (): AssociateAPI => ({
  metadata: getDefaultMetadata(),
  role: getDefaultTextWithMetadata(),
  startDate: getDefaultOptionalDateWithMetadata(),
  endDate: getDefaultOptionalDateWithMetadata(),
  equity: getDefaultNumberWithMetadata(),
  isActive: getDefaultBooleanWithMetadata(),
  customFields: [],
})

export const getDefaultPersonAssociate = (_id: string): AssociateAPI => ({
  ...getDefaultAssociate(),
  person: { _id },
})

export const getDefaultCompanyAssociate = (_id: string): AssociateAPI => ({
  ...getDefaultAssociate(),
  company: { _id },
})
