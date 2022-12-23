import { CustomField, CustomFieldAPI } from '@app/definitions/customField'
import { Party, PartyAPI, PartyIndex } from '@app/definitions/party'
import { EmbeddedFileIndex, File, FileAPIInput, FileAPIOutput } from '@app/definitions/file'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@app/definitions/connectedEntity'

export interface Incident {
  _id?: string
  type: string
  date: Date
  location: string
  description: string
  parties: Party[]
  customFields: CustomField[]
  files: File[]
}

export interface IncidentAPIInput extends Omit<Incident, '_id' | 'parties'> {
  parties: PartyAPI[]
  customFields: CustomFieldAPI[]
  files: FileAPIInput[]
}

export interface IncidentAPIOutput extends Omit<Incident, 'parties'> {
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
