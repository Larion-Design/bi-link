import { EventAPIInput, EventParticipantAPI } from 'defs'
import { getDefaultMetadata } from './metadata'
import { getDefaultOptionalDateWithMetadata, getDefaultTextWithMetadata } from './valueWithMetadata'

export const getDefaultEvent = (): EventAPIInput => ({
  metadata: getDefaultMetadata(),
  type: getDefaultTextWithMetadata(),
  description: '',
  date: getDefaultOptionalDateWithMetadata(),
  location: null,
  customFields: [],
  parties: [],
  files: [],
})

export const getDefaultParticipant = (): EventParticipantAPI => ({
  metadata: getDefaultMetadata(),
  type: '',
  description: '',
  persons: [],
  companies: [],
  properties: [],
  customFields: [],
})
