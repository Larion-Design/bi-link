import { InstitutionAPIInput } from 'defs'
import { getDefaultLocation } from './location'
import { getDefaultMetadata } from './metadata'

export const getDefaultInstitution = (): InstitutionAPIInput => ({
  metadata: getDefaultMetadata(),
  name: '',
  type: '',
  location: getDefaultLocation(),
  contactDetails: [],
  customFields: [],
  files: [],
})
