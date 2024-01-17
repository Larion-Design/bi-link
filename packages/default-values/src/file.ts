import { FileAPIInput } from 'defs'
import { getDefaultMetadata } from './metadata'

export const getDefaultFile = (fileId: string): FileAPIInput => ({
  metadata: getDefaultMetadata(),
  fileId,
  name: '',
  hash: '',
  description: '',
  isHidden: false,
  category: '',
  tags: [],
})
