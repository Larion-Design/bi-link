import { CustomFieldAPI } from 'defs'
import { getDefaultMetadata } from './metadata'

export const getDefaultCustomField = (): CustomFieldAPI => ({
  metadata: getDefaultMetadata(),
  fieldName: '',
  fieldValue: '',
})
