import { CustomField } from './customField'
import { Person } from './person'
import { Company } from './company'
import { ConnectedCompanyIndex, ConnectedEntity, ConnectedPersonIndex } from './connectedEntity'
import { NodesRelationship } from './entitiesGraph'

export interface Associate {
  role: string
  startDate?: Date
  endDate?: Date
  isActive?: boolean
  customFields: CustomField[]
  person?: Person
  company?: Company
  equity: number
  _confirmed: boolean
}

interface AssociateAPI extends Omit<Associate, 'person' | 'company'> {
  person?: ConnectedEntity | null
  company?: ConnectedEntity | null
}

export interface PersonAssociateIndex extends ConnectedPersonIndex {}

export interface CompanyAssociateIndex extends ConnectedCompanyIndex {}

export interface AssociateAPIOutput extends AssociateAPI {}

export interface AssociateAPIInput extends Readonly<AssociateAPI> {}

export interface CompanyAssociateRelationship
  extends NodesRelationship,
    Pick<Associate, 'role' | 'equity'> {}
