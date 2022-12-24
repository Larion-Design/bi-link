import { Company } from 'defs'

export interface CompanyGraphNode
  extends Required<Pick<Company, '_id' | 'name' | 'cui' | 'registrationNumber'>> {}
