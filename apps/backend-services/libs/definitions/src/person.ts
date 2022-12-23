import { IdDocument, IdDocumentIndex } from '@app/definitions/idDocument'
import { EmbeddedFileIndex, File, FileAPIInput, FileAPIOutput } from '@app/definitions/file'
import {
  Relationship,
  RelationshipAPIInput,
  RelationshipAPIOutput,
} from '@app/definitions/relationship'
import { CustomField } from '@app/definitions/customField'
import { EntityMetadata } from '@app/definitions/entitiesGraph'

export interface Person {
  _id?: string
  birthdate: Date | string | null
  firstName: string
  lastName: string
  oldName: string
  cnp: string
  homeAddress: string
  image: File | null
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

export interface PersonListRecord extends PersonSearchIndex, Pick<Person, '_id'> {}

export interface PersonAPIOutput
  extends Readonly<Omit<Person, 'relationships' | 'files' | 'image'>> {
  relationships: RelationshipAPIOutput[]
  files: FileAPIOutput[]
  image: FileAPIOutput | null
}

export interface PersonAPIInput
  extends Readonly<Omit<Person, '_id' | 'relationships' | 'files' | 'image'>> {
  files: FileAPIInput[]
  image: FileAPIInput | null
  relationships: RelationshipAPIInput[]
}

export interface PersonGraphNode extends EntityMetadata, Required<Pick<Person, '_id' | 'cnp'>> {
  firstName: string
  lastName: string
  documents: string[]
}
