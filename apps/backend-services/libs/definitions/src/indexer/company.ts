import { Company } from 'defs'
import { ConnectedCompanyIndex, ConnectedPersonIndex } from '@app/definitions'
import { EmbeddedFileIndex } from '@app/definitions'
import { LocationIndex } from '@app/definitions'

export type CompanyIndex = Pick<
  Company,
  'name' | 'cui' | 'registrationNumber' | 'contactDetails' | 'customFields'
> & {
  headquarters?: LocationIndex
  locations: LocationIndex[]
  files: EmbeddedFileIndex[]
  associatedCompanies: ConnectedCompanyIndex[]
  associatedPersons: ConnectedPersonIndex[]
}
export type CompanySearchIndex = Readonly<Pick<CompanyIndex, 'name' | 'cui' | 'registrationNumber'>>
