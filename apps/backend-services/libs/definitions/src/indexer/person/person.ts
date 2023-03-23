import { Person } from 'defs'
import { EmbeddedFileIndex } from '@app/definitions'
import { LocationIndex } from '@app/definitions'
import { EducationIndex } from '@app/definitions'
import { OldNameIndex } from '@app/definitions'
import { IdDocumentIndex } from '@app/definitions'

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
