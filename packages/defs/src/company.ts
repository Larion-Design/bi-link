import { CustomFieldAPI } from './customField'
import {
  AssociateAPIInput,
  AssociateAPIOutput,
  CompanyAssociateIndex,
  PersonAssociateIndex,
} from './associate'
import { EmbeddedFileIndex, FileAPIInput, FileAPIOutput } from './file'
import { LocationAPIInput, LocationAPIOutput, LocationIndex } from './location'

export interface Company {
  _id: string
  cui: string
  name: string
  headquarters: string
  registrationNumber: string
  contactDetails: CustomFieldAPI[]
  locations: LocationAPIInput[]
  associates: AssociateAPIInput[]
  customFields: CustomFieldAPI[]
  files: FileAPIInput[]
}

export type CompanyIndex = Pick<
  Company,
  'name' | 'cui' | 'headquarters' | 'registrationNumber' | 'contactDetails' | 'customFields'
> & {
  locations: LocationIndex[]
  files: EmbeddedFileIndex[]
  associatedCompanies: CompanyAssociateIndex[]
  associatedPersons: PersonAssociateIndex[]
}

export type CompanySearchIndex = Readonly<Pick<CompanyIndex, 'name' | 'cui' | 'registrationNumber'>>

export interface CompanyListRecord extends CompanySearchIndex, Required<Pick<Company, '_id'>> {}

export interface CompanyAPIOutput
  extends Readonly<Omit<Company, 'associates' | 'locations' | 'files'>> {
  associates: AssociateAPIOutput[]
  locations: LocationAPIOutput[]
  files: FileAPIOutput[]
}

export interface CompanyAPIInput
  extends Omit<Company, '_id' | 'associates' | 'locations' | 'files'> {
  associates: AssociateAPIInput[]
  locations: LocationAPIInput[]
  files: FileAPIInput[]
}

export interface CompaniesSuggestions {
  total: number
  records: CompanyListRecord[]
}
