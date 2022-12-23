import { CustomField } from './customField'
import {
  Associate,
  AssociateAPIInput,
  AssociateAPIOutput,
  CompanyAssociateIndex,
  PersonAssociateIndex,
} from './associate'
import { EmbeddedFileIndex } from './file'

export interface Company {
  _id?: string
  cui: string
  name: string
  headquarters?: string
  registrationNumber: string
  contactDetails?: CustomField[]
  locations: Location[]
  associates: Associate[]
  customFields: CustomField[]
  files: File[]
}

export type CompanyIndex = Pick<
  Company,
  'name' | 'cui' | 'headquarters' | 'registrationNumber' | 'contactDetails' | 'customFields'
> & {
  locations: string[]
  files: EmbeddedFileIndex[]
  associatedCompanies: CompanyAssociateIndex[]
  associatedPersons: PersonAssociateIndex[]
}

export type CompanySearchIndex = Readonly<Pick<CompanyIndex, 'name' | 'cui' | 'registrationNumber'>>

export interface CompanyListRecord extends CompanySearchIndex, Pick<Company, '_id'> {}

export interface CompanyAPIOutput extends Readonly<Omit<Company, 'associates'>> {
  associates: AssociateAPIOutput[]
}

export interface CompanyAPIInput extends Readonly<Omit<Company, '_id' | 'associates'>> {
  associates: AssociateAPIInput[]
}
