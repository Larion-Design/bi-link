import { getDefaultLocation } from '@frontend/components/form/location'
import { EventAPIInput } from 'defs'

export const getDefaultEvent = (): EventAPIInput => ({
  description: '',
  type: '',
  date: null,
  location: getDefaultLocation(),
  parties: [],
  files: [],
  customFields: [],
})
