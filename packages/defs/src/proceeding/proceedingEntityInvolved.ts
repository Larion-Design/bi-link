import { Company } from '../company'
import { ConnectedEntity } from '../connectedEntity'
import { NodesRelationship } from '../graphRelationships'
import { Person } from '../person'

export interface ProceedingEntityInvolved {
  person?: Person
  company?: Company
  involvedAs: string
  description: string
}

export interface ProceedingEntityInvolvedAPI
  extends Omit<ProceedingEntityInvolved, 'person' | 'company'> {
  person?: ConnectedEntity
  company?: ConnectedEntity
}

export interface ProceedingEntityRelationship
  extends NodesRelationship,
    Pick<ProceedingEntityInvolved, 'involvedAs'> {}
