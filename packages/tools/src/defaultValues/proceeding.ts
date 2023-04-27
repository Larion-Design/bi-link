import { ProceedingAPIInput, ProceedingEntityInvolvedAPI } from 'defs'
import { getDefaultMetadata } from './metadata'
import { getDefaultNumberWithMetadata, getDefaultTextWithMetadata } from './valueWithMetadata'

export const getDefaultProceeding = (): ProceedingAPIInput => ({
  metadata: getDefaultMetadata(),
  name: '',
  type: '',
  description: '',
  reason: getDefaultTextWithMetadata(),
  fileNumber: getDefaultTextWithMetadata(),
  year: getDefaultNumberWithMetadata(),
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
