import { Person } from './person'
import { CustomField } from './customField'
import { Company } from './company'
import { ConnectedEntity } from './connectedEntity'
import { NodesRelationship } from './entitiesGraph'
import { Property } from './property'

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

export interface PartyIndex
  extends Omit<Party, 'persons' | 'companies' | 'properties' | '_confirmed'> {}

export interface IncidentPartyRelationship extends NodesRelationship, Pick<Party, 'name'> {}
