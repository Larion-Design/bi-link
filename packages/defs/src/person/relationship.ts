import { Person } from './person'
import { ConnectedEntity } from '../connectedEntity'
import { NodesRelationship } from '../graphRelationships'

export interface Relationship {
  type: string
  proximity: number
  person: Person
  _confirmed: boolean
  description: string
  relatedPersons: Person[]
}

interface RelationshipAPI extends Omit<Relationship, 'person' | 'relatedPersons'> {
  person: ConnectedEntity
  relatedPersons: ConnectedEntity[]
}

export interface RelationshipAPIOutput extends RelationshipAPI {}
export interface RelationshipAPIInput extends Readonly<RelationshipAPI> {}

export interface PersonalRelationship extends NodesRelationship, Pick<Relationship, 'type'> {}
