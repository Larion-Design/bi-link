import { Person } from './person'
import { ConnectedEntity } from '../connectedEntity'
import { NodesRelationship } from '../entitiesGraph'

export interface Relationship {
  type: string
  proximity: number
  person: Person
  _confirmed: boolean
}

interface RelationshipAPI extends Omit<Relationship, 'person'> {
  person: ConnectedEntity
}

export interface RelationshipAPIOutput extends RelationshipAPI {}
export interface RelationshipAPIInput extends Readonly<RelationshipAPI> {}

export interface PersonalRelationship extends NodesRelationship, Pick<Relationship, 'type'> {}
