import { EntityMetadata, Report } from 'defs'

export interface ReportGraphNode
  extends EntityMetadata,
    Required<Pick<Report, '_id' | 'name' | 'type'>> {}
