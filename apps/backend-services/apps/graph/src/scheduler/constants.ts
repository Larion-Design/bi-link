import { UpdateSource } from 'defs'

export const QUEUE_GRAPH_PERSONS = 'graph_persons'
export const QUEUE_GRAPH_COMPANIES = 'graph_companies'
export const QUEUE_GRAPH_FILES = 'graph_files'
export const QUEUE_GRAPH_EVENTS = 'graph_events'
export const QUEUE_GRAPH_PROPERTIES = 'graph_properties'
export const QUEUE_GRAPH_REPORTS = 'graph_reports'
export const QUEUE_GRAPH_PROCEEDINGS = 'graph_proceedings'

export const AUTHOR: UpdateSource = {
  type: 'SERVICE',
  sourceId: 'SERVICE_GRAPH',
}
