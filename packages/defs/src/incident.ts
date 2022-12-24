import { Party, PartyAPI, PartyIndex } from './party'
import { CustomField, CustomFieldAPI } from './customField'
import { EmbeddedFileIndex, File, FileAPIInput, FileAPIOutput } from './file'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from './connectedEntity'

export interface Incident {
  _id: string
  type: string
  date: Date | null
  location: string
  description: string
  parties: Party[]
  customFields: CustomField[]
  files: File[]
}

export interface IncidentAPIInput extends Omit<Incident, '_id' | 'parties' | 'files'> {
  parties: PartyAPI[]
  customFields: CustomFieldAPI[]
  files: FileAPIInput[]
}

export interface IncidentAPIOutput extends Omit<Incident, 'parties' | 'files'> {
  parties: PartyAPI[]
  customFields: CustomFieldAPI[]
  files: FileAPIOutput[]
}

export interface IncidentIndex
  extends Pick<Incident, 'type' | 'location' | 'description' | 'customFields'> {
  date: string
  files: EmbeddedFileIndex[]
  parties: PartyIndex[]
  persons: ConnectedPersonIndex[]
  companies: ConnectedCompanyIndex[]
  properties: ConnectedPropertyIndex[]
}

export interface IncidentSearchIndex extends Pick<IncidentIndex, 'date' | 'location' | 'type'> {}

export interface IncidentListRecord
  extends Required<Pick<Incident, '_id' | 'type' | 'date' | 'location'>> {}

export interface IncidentsSuggestions {
  total: number
  records: IncidentListRecord[]
}
