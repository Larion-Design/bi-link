import { Company } from '@app/definitions/company'

export interface CompanyGraphNode
  extends Required<Pick<Company, '_id' | 'name' | 'cui' | 'registrationNumber'>> {}
