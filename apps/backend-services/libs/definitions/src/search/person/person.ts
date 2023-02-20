import { Person } from 'defs'
import { EmbeddedFileIndex } from '@app/definitions/search/file'
import { LocationIndex } from '@app/definitions/search/location'
import { EducationIndex } from '@app/definitions/search/person/education'
import { OldNameIndex } from '@app/definitions/search/person/oldName'
import { IdDocumentIndex } from '@app/definitions/search/person/idDocument'

export type PersonIndex = Pick<
  Person,
  'firstName' | 'lastName' | 'cnp' | 'birthdate' | 'contactDetails' | 'customFields'
> & {
  documents: IdDocumentIndex[]
  oldNames: OldNameIndex[]
  files: EmbeddedFileIndex[]
  birthPlace: LocationIndex
  homeAddress: LocationIndex
  education: EducationIndex[]
}
export type PersonSearchIndex = Pick<PersonIndex, 'firstName' | 'lastName' | 'cnp'>
