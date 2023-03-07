import { Proceeding } from 'defs'
import { ConnectedCompanyIndex, ConnectedPersonIndex } from '@app/definitions'

export interface ProceedingIndex
  extends Pick<Proceeding, '_id' | 'name' | 'type' | 'fileNumber' | 'description'> {
  persons: ConnectedPersonIndex[]
  companies: ConnectedCompanyIndex[]
}

export interface EmbeddedProceedingIndex
  extends Pick<Proceeding, '_id' | 'name' | 'type' | 'fileNumber' | 'description'> {}
