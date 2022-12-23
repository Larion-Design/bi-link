import { Company } from './company'
import { ConnectedCompanyIndex, ConnectedEntity, ConnectedPersonIndex } from './connectedEntity'
import { CustomField } from './customField'
import { Person } from './person'

export interface Owner {
  person?: Person | null
  company?: Company | null
  startDate: Date | null
  endDate: Date | null
  registrationNumber: string
  customFields: CustomField[]
  _confirmed: boolean
}

interface OwnerAPI extends Omit<Owner, 'person' | 'company' | 'startDate' | 'endDate'> {
  person?: ConnectedEntity | null
  company?: ConnectedEntity | null
  startDate: Date | null
  endDate: Date | null
}

export interface OwnerAPIOutput extends OwnerAPI {}
export interface OwnerAPIInput extends Readonly<OwnerAPI> {}

interface OwnerIndex extends Pick<Owner, 'customFields'> {}
export interface CompanyOwnerIndex extends ConnectedCompanyIndex, OwnerIndex {}
export interface PersonOwnerIndex extends ConnectedPersonIndex, OwnerIndex {}
