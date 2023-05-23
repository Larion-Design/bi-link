import { ProceedingAPIInput, ProceedingEntityInvolvedAPI } from 'defs'
import { getDefaultMetadata } from './metadata'
import { getDefaultOptionalDateWithMetadata, getDefaultTextWithMetadata } from './valueWithMetadata'

export const getDefaultProceeding = (): ProceedingAPIInput => ({
  metadata: getDefaultMetadata(),
  name: '',
  type: '',
  description: '',
  status: getDefaultTextWithMetadata(),
  reason: getDefaultTextWithMetadata(),
  fileNumber: getDefaultTextWithMetadata(),
  year: getDefaultOptionalDateWithMetadata(),
  entitiesInvolved: [],
  customFields: [],
  files: [],
})

export const getDefaultInvolvedEntity = (): ProceedingEntityInvolvedAPI => ({
  metadata: getDefaultMetadata(),
  description: '',
  involvedAs: '',
})

export const getDefaultInvolvedPerson = (_id: string): ProceedingEntityInvolvedAPI => ({
  ...getDefaultInvolvedEntity(),
  person: { _id },
})

export const getDefaultInvolvedCompany = (_id: string): ProceedingEntityInvolvedAPI => ({
  ...getDefaultInvolvedEntity(),
  company: { _id },
})
