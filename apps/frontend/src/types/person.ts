import { IdDocument, IdDocumentIndex } from './idDocument'
import { Relationship, RelationshipAPIInput, RelationshipAPIOutput } from './relationship'
import { CustomField } from './customField'
import { EmbeddedFileIndex, FileAPIInput, FileAPIOutput } from './file'

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

export interface PersonListRecord extends PersonSearchIndex, Required<Pick<Person, '_id'>> {}

export interface PersonAPIOutput extends Omit<Person, 'relationships' | 'files' | 'image'> {
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

export interface PersonsSuggestions<T> {
  total: number
  records: T[]
}

export interface PersonListRecordWithImage
  extends PersonListRecord,
    Required<Pick<PersonAPIOutput, 'image'>> {}
