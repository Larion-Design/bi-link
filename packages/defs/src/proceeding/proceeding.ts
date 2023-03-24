import { CustomField } from '../customField'
import { File, FileAPIInput, FileAPIOutput } from '../file'
import { SearchSuggestions } from '../searchSuggestions'
import { ProceedingEntityInvolved, ProceedingEntityInvolvedAPI } from './proceedingEntityInvolved'

export interface Proceeding {
  _id?: string
  name: string
  type: string
  reason: string
  year: number
  fileNumber: string
  description: string
  entitiesInvolved: ProceedingEntityInvolved[]
  customFields: CustomField[]
  files: File[]
}

interface ProceedingAPI extends Omit<Proceeding, 'entitiesInvolved' | 'files'> {
  entitiesInvolved: ProceedingEntityInvolvedAPI[]
}

export interface ProceedingAPIInput extends Omit<ProceedingAPI, '_id'> {
  files: FileAPIInput[]
}

export interface ProceedingAPIOutput extends ProceedingAPI {
  files: FileAPIOutput[]
}

export interface ProceedingListRecord
  extends Pick<Proceeding, '_id' | 'name' | 'type' | 'year' | 'fileNumber'> {}

export interface ProceedingSuggestions extends SearchSuggestions<ProceedingListRecord> {}
