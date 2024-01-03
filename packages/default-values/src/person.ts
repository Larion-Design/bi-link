import { EducationAPIInput, IdDocumentAPI, OldName, PersonAPIInput, RelationshipAPI } from 'defs'
import { getDefaultLocation } from './location'
import { getDefaultMetadata } from './metadata'
import { getDefaultOptionalDateWithMetadata, getDefaultTextWithMetadata } from './valueWithMetadata'

export const getDefaultIdDocument = (documentType = ''): IdDocumentAPI => ({
  metadata: getDefaultMetadata(),
  documentType,
  documentNumber: '',
  issueDate: null,
  expirationDate: null,
  status: 'VALID',
})

export const getDefaultEducation = (): EducationAPIInput => ({
  metadata: getDefaultMetadata(),
  type: '',
  school: '',
  specialization: '',
  startDate: null,
  endDate: null,
})

export const getDefaultOldName = (): OldName => ({
  metadata: getDefaultMetadata(),
  name: '',
  changeReason: '',
})

export const getDefaultRelationship = (personId: string): RelationshipAPI => ({
  metadata: getDefaultMetadata(),
  type: '',
  proximity: 0,
  description: '',
  relatedPersons: [],
  person: {
    _id: personId,
  },
})

export const getDefaultPerson = (): PersonAPIInput => ({
  metadata: getDefaultMetadata(),
  firstName: getDefaultTextWithMetadata(),
  lastName: getDefaultTextWithMetadata(),
  oldNames: [],
  contactDetails: [],
  cnp: getDefaultTextWithMetadata(),
  birthdate: getDefaultOptionalDateWithMetadata(),
  birthPlace: getDefaultLocation(),
  homeAddress: getDefaultLocation(),
  documents: [],
  education: [],
  relationships: [],
  images: [],
  files: [],
  customFields: [],
})
