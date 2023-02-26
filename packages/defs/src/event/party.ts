import { Company } from '../company'
import { ConnectedEntity } from '../connectedEntity'
import { CustomField } from '../customField'
import { NodesRelationship } from '../graphRelationships'
import { Person } from '../person'
import { Property } from '../property'

export interface Party {
  name: string
  description: string
  persons: Person[]
  companies: Company[]
  properties: Property[]
  customFields: CustomField[]
  _confirmed: boolean
}

export interface PartyAPI extends Omit<Party, 'persons' | 'companies' | 'properties'> {
  persons: ConnectedEntity[]
  companies: ConnectedEntity[]
  properties: ConnectedEntity[]
}

export interface IncidentPartyRelationship extends NodesRelationship, Pick<Party, 'name'> {}
