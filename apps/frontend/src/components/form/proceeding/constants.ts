import { ProceedingAPIInput } from 'defs'

export const getDefaultProceeding = (): ProceedingAPIInput => ({
  name: '',
  type: '',
  fileNumber: '',
  year: 0,
  reason: '',
  description: '',
  entitiesInvolved: [],
  files: [],
  customFields: [],
})
