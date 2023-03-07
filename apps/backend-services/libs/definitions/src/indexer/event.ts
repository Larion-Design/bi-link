import { Event, Party } from 'defs'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@app/definitions'
import { EmbeddedFileIndex } from '@app/definitions'
import { LocationIndex } from '@app/definitions'

export interface EventIndex extends Pick<Event, 'type' | 'description' | 'customFields'> {
  date: string
  location: LocationIndex
  files: EmbeddedFileIndex[]
  parties: PartyIndex[]
  persons: ConnectedPersonIndex[]
  companies: ConnectedCompanyIndex[]
  properties: ConnectedPropertyIndex[]
}

export interface EventSearchIndex extends Pick<EventIndex, 'date' | 'location' | 'type'> {}

export interface PartyIndex
  extends Omit<Party, 'persons' | 'companies' | 'properties' | '_confirmed'> {}
