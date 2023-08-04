import { UpdateSource } from 'defs'

export const QUEUE_PERSONS = 'indexer_persons'
export const QUEUE_COMPANIES = 'indexer_companies'
export const QUEUE_FILES = 'indexer_files'
export const QUEUE_EVENTS = 'indexer_events'
export const QUEUE_PROPERTIES = 'indexer_properties'
export const QUEUE_PROCEEDINGS = 'indexer_proceedings'

export const AUTHOR: UpdateSource = {
  type: 'SERVICE',
  sourceId: 'SERVICE_INDEXER',
}
