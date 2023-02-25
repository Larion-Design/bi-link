import { getDefaultLocation } from '@frontend/components/form/location'
import { PersonAPIInput } from 'defs'

export const getDefaultPerson = (): PersonAPIInput => ({
  firstName: '',
  lastName: '',
  oldNames: [],
  cnp: '',
  birthdate: null,
  birthPlace: getDefaultLocation(),
  homeAddress: getDefaultLocation(),
  customFields: [],
  contactDetails: [],
  images: [],
  documents: [],
  files: [],
  relationships: [],
  education: [],
})
