import { CustomField } from '../customField'
import { Person } from '../person'
import { Company } from './company'
import { ConnectedEntity } from '../connectedEntity'
import { NodesRelationship } from '../graphRelationships'

export interface Associate {
  role: string
  startDate: Date | null
  endDate: Date | null
  isActive: boolean
  customFields: CustomField[]
  person?: Person
  company?: Company
  equity: number
  _confirmed: boolean
}

interface AssociateAPI extends Omit<Associate, 'person' | 'company'> {
  person?: ConnectedEntity
  company?: ConnectedEntity
}

export interface AssociateAPIOutput extends AssociateAPI {}

export interface AssociateAPIInput extends Readonly<AssociateAPI> {}

export interface CompanyAssociateRelationship
  extends NodesRelationship,
    Pick<Associate, 'role' | 'equity'> {}
