import { ProceedingEntityInvolved, ProceedingEntityInvolvedAPI } from './proceedingEntityInvolved'

export interface Proceeding {
  _id?: string
  name: string
  type: string
  fileNumber: string
  description: string
  entitiesInvolved: ProceedingEntityInvolved[]
}

interface ProceedingAPI extends Omit<Proceeding, 'entitiesInvolved'> {
  entitiesInvolved: ProceedingEntityInvolvedAPI[]
}

export interface ProceedingAPIInput extends Omit<ProceedingAPI, '_id'> {}
export interface ProceedingAPIOutput extends ProceedingAPI {}
