import { Proceeding } from 'defs'
import { ConnectedCompanyIndex, ConnectedPersonIndex, EmbeddedFileIndex } from '@app/definitions'

export interface ProceedingIndex
  extends Pick<
    Proceeding,
    '_id' | 'name' | 'type' | 'fileNumber' | 'description' | 'year' | 'customFields'
  > {
  persons: ConnectedPersonIndex[]
  companies: ConnectedCompanyIndex[]
  files: EmbeddedFileIndex[]
}

export interface EmbeddedProceedingIndex
  extends Pick<Proceeding, '_id' | 'name' | 'type' | 'fileNumber' | 'description'> {}
