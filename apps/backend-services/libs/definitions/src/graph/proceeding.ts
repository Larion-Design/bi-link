import { EntityMetadata, Proceeding } from 'defs'

export interface ProceedingGraphNode
  extends EntityMetadata,
    Pick<Proceeding, 'fileNumber' | 'type'> {}
