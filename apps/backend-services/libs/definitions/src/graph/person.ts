import { EntityMetadata, Person } from 'defs'

export interface PersonGraphNode extends EntityMetadata, Required<Pick<Person, '_id' | 'cnp'>> {
  firstName: string
  lastName: string
  documents: string[]
}
