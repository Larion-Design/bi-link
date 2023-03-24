import { CustomField, CustomFieldAPI } from '../customField'
import { NodesRelationship } from '../graphRelationships'
import { File, FileAPIInput, FileAPIOutput } from '../file'
import { Location, LocationAPIInput, LocationAPIOutput } from '../geolocation'
import { SearchSuggestions } from '../searchSuggestions'
import { Party, PartyAPI } from './party'

export interface Event {
  _id: string
  type: string
  date: Date | null
  location: Location
  description: string
  parties: Party[]
  customFields: CustomField[]
  files: File[]
}

interface EventAPI extends Omit<Event, 'parties' | 'files' | 'location' | 'customFields'> {}

export interface EventAPIInput extends Omit<EventAPI, '_id'> {
  parties: PartyAPI[]
  customFields: CustomFieldAPI[]
  files: FileAPIInput[]
  location: LocationAPIInput
}

export interface EventAPIOutput extends EventAPI {
  parties: PartyAPI[]
  customFields: CustomFieldAPI[]
  files: FileAPIOutput[]
  location: LocationAPIOutput
}

export interface EventListRecord extends Required<Pick<Event, '_id' | 'type' | 'date'>> {
  location: string
}

export interface EventsSuggestions extends SearchSuggestions<EventListRecord> {}

export interface EventPartyRelationship extends NodesRelationship, Pick<Party, 'name'> {}
