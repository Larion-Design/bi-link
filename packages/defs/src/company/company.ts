import { CustomField } from '../customField'
import { FileAPIInput, FileAPIOutput } from '../file'
import { Location, LocationAPIInput, LocationAPIOutput } from '../geolocation'
import { SearchSuggestions } from '../searchSuggestions'
import { Associate, AssociateAPIInput, AssociateAPIOutput } from './associate'

export interface Company {
  _id: string
  cui: string
  name: string
  headquarters: Location | null
  registrationNumber: string
  contactDetails: CustomField[]
  locations: Location[]
  associates: Associate[]
  customFields: CustomField[]
  files: FileAPIInput[]
}

export interface CompanyListRecord
  extends Pick<Company, '_id' | 'name' | 'cui' | 'registrationNumber'> {}

interface CompanyAPI
  extends Readonly<Omit<Company, 'associates' | 'locations' | 'files' | 'headquarters'>> {}

export interface CompanyAPIOutput extends CompanyAPI {
  associates: AssociateAPIOutput[]
  headquarters: LocationAPIOutput | null
  locations: LocationAPIOutput[]
  files: FileAPIOutput[]
}

export interface CompanyAPIInput extends Omit<CompanyAPI, '_id'> {
  headquarters: LocationAPIInput | null
  associates: AssociateAPIInput[]
  locations: LocationAPIInput[]
  files: FileAPIInput[]
}

export interface CompaniesSuggestions extends SearchSuggestions<CompanyListRecord> {}
