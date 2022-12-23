import { ConnectedEntity } from '@app/definitions/connectedEntity'
import { CustomField } from '@app/definitions/customField'
import { Person } from '@app/definitions/person'
import { Company } from '@app/definitions/company'
import { NodesRelationship } from '@app/definitions/entitiesGraph'
import { Property } from '@app/definitions/property'

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
