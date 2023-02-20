import { Company } from 'defs'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
} from '@app/definitions/search/connectedEntity'
import { EmbeddedFileIndex } from '@app/definitions/search/file'
import { LocationIndex } from '@app/definitions/search/location'

export type CompanyIndex = Pick<
  Company,
  'name' | 'cui' | 'registrationNumber' | 'contactDetails' | 'customFields'
> & {
  headquarters: LocationIndex
  locations: LocationIndex[]
  files: EmbeddedFileIndex[]
  associatedCompanies: ConnectedCompanyIndex[]
  associatedPersons: ConnectedPersonIndex[]
}
export type CompanySearchIndex = Readonly<Pick<CompanyIndex, 'name' | 'cui' | 'registrationNumber'>>
