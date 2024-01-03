import { Company, Person } from 'defs'

export const EVENT = {
  PERSON_CREATED: 'person.created',
  PERSON_UPDATED: 'person.updated',
  COMPANY_CREATED: 'company.created',
  COMPANY_UPDATED: 'company.updated',
} as const

export interface OnPersonCreated {
  onPersonCreated: (person: Person) => void | Promise<void>
}

export interface OnPersonUpdated {
  onPersonUpdated: (person: Person) => void | Promise<void>
}

export interface OnCompanyCreated {
  onCompanyCreated: (company: Company) => void | Promise<void>
}

export interface OnCompanyUpdated {
  onCompanyUpdated: (company: Company) => void | Promise<void>
}
