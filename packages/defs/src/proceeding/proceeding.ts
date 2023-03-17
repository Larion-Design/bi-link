import { CustomField } from '../customField'
import { ProceedingEntityInvolved, ProceedingEntityInvolvedAPI } from './proceedingEntityInvolved'

export interface Proceeding {
  _id?: string
  name: string
  type: string
  reason: string
  year: number
  fileNumber: string
  description: string
  entitiesInvolved: ProceedingEntityInvolved[]
  customFields: CustomField[]
}

interface ProceedingAPI extends Omit<Proceeding, 'entitiesInvolved'> {
  entitiesInvolved: ProceedingEntityInvolvedAPI[]
}

export interface ProceedingAPIInput extends Omit<ProceedingAPI, '_id'> {}
export interface ProceedingAPIOutput extends ProceedingAPI {}
