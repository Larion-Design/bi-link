import { CustomFieldAPI } from 'defs'
import { getDefaultMetadata } from './metadata'

export const getDefaultCustomField = (fieldName = ''): CustomFieldAPI => ({
  metadata: getDefaultMetadata(),
  fieldName,
  fieldValue: '',
})
