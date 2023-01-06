import { CustomField } from './customField'
import { EntityMetadata } from './entitiesGraph'
import { EmbeddedFileIndex, File, FileAPIInput, FileAPIOutput } from './file'
import { IdDocument, IdDocumentIndex } from './idDocument'
import { Relationship, RelationshipAPIInput, RelationshipAPIOutput } from './relationship'

export interface Person {
  _id: string
  birthdate: Date | string | null
  firstName: string
  lastName: string
  oldName: string
  cnp: string
  homeAddress: string
  images: File[]
  documents: IdDocument[]
  relationships: Relationship[]
  files: File[]
  contactDetails: CustomField[]
  customFields: CustomField[]
}

export type PersonIndex = Pick<
  Person,
  | 'firstName'
  | 'lastName'
  | 'oldName'
  | 'cnp'
  | 'homeAddress'
  | 'birthdate'
  | 'contactDetails'
  | 'customFields'
> & {
  documents: IdDocumentIndex[]
  files: EmbeddedFileIndex[]
}

export type PersonSearchIndex = Pick<PersonIndex, 'firstName' | 'lastName' | 'cnp'>

export interface PersonListRecord extends PersonSearchIndex, Required<Pick<Person, '_id'>> {}

export interface PersonListRecordWithImage
  extends PersonListRecord,
    Required<Pick<PersonAPIOutput, 'images'>> {}

export interface PersonsSuggestions<T> {
  total: number
  records: T[]
}

export interface PersonAPIOutput
  extends Readonly<Omit<Person, 'relationships' | 'files' | 'images'>> {
  relationships: RelationshipAPIOutput[]
  files: FileAPIOutput[]
  images: FileAPIOutput[]
}

export interface PersonAPIInput
  extends Readonly<Omit<Person, '_id' | 'relationships' | 'files' | 'images'>> {
  files: FileAPIInput[]
  images: FileAPIInput[]
  relationships: RelationshipAPIInput[]
}

export interface PersonGraphNode extends EntityMetadata, Required<Pick<Person, '_id' | 'cnp'>> {
  firstName: string
  lastName: string
  documents: string[]
}
