import { CustomField } from '../customField'
import { File, FileAPIInput, FileAPIOutput } from '../file'
import { Location, LocationAPIInput, LocationAPIOutput } from '../geolocation'
import { SearchSuggestions } from '../searchSuggestions'
import { Education, EducationAPIInput, EducationAPIOutput } from './education'
import { IdDocument } from './idDocument'
import { OldName, OldNameAPIInput, OldNameAPIOutput } from './oldName'
import { Relationship, RelationshipAPIInput, RelationshipAPIOutput } from './relationship'

export interface Person {
  _id: string
  birthdate: Date | string | null
  birthPlace: Location | null
  firstName: string
  lastName: string
  oldNames: OldName[]
  cnp: string
  homeAddress: Location | null
  education: Education[]
  images: File[]
  documents: IdDocument[]
  relationships: Relationship[]
  files: File[]
  contactDetails: CustomField[]
  customFields: CustomField[]
}

export interface PersonListRecord extends Pick<Person, '_id' | 'firstName' | 'lastName' | 'cnp'> {}

export interface PersonListRecordWithImage
  extends PersonListRecord,
    Required<Pick<PersonAPIOutput, 'images'>> {}

export interface PersonsSuggestions<T> extends SearchSuggestions<T> {}

interface PersonAPI
  extends Readonly<
    Omit<Person, 'relationships' | 'files' | 'images' | 'oldNames' | 'birthPlace' | 'homeAddress'>
  > {}

export interface PersonAPIOutput extends PersonAPI {
  relationships: RelationshipAPIOutput[]
  files: FileAPIOutput[]
  images: FileAPIOutput[]
  oldNames: OldNameAPIOutput[]
  education: EducationAPIOutput[]
  birthPlace: LocationAPIOutput | null
  homeAddress: LocationAPIOutput | null
}

export interface PersonAPIInput extends Omit<PersonAPI, '_id'> {
  files: FileAPIInput[]
  images: FileAPIInput[]
  relationships: RelationshipAPIInput[]
  oldNames: OldNameAPIInput[]
  education: EducationAPIInput[]
  birthPlace: LocationAPIInput | null
  homeAddress: LocationAPIInput | null
}
