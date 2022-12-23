import { CustomField } from '@app/definitions/customField'
import { Person } from '@app/definitions/person'
import { Company } from '@app/definitions/company'
import {
  ConnectedCompanyIndex,
  ConnectedEntity,
  ConnectedPersonIndex,
} from '@app/definitions/connectedEntity'
import { NodesRelationship } from '@app/graph-module/types'

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
