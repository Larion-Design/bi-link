import { Company } from '@app/definitions/company'
import { Person } from '@app/definitions/person'
import {
  ReportSection,
  ReportSectionAPIInput,
  ReportSectionAPIOutput,
} from '@app/definitions/reports/reportSection'
import { ConnectedEntity } from '@app/definitions/connectedEntity'
import { Incident } from '@app/definitions/incident'
import { Property } from '@app/definitions/property'

export interface Report {
  _id?: string
  name: string
  company?: Company
  person?: Person
  incident?: Incident
  property?: Property
  sections: ReportSection[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ReportAPIInput
  extends Omit<Report, '_id' | 'sections' | 'person' | 'company' | 'property' | 'incident'> {
  person?: ConnectedEntity
  company?: ConnectedEntity
  property?: ConnectedEntity
  incident?: ConnectedEntity
  sections: ReportSectionAPIInput[]
}

export interface ReportAPIOutput
  extends Omit<Required<Report>, 'sections' | 'person' | 'company' | 'property' | 'incident'> {
  person?: ConnectedEntity
  company?: ConnectedEntity
  property?: ConnectedEntity
  incident?: ConnectedEntity
  sections: ReportSectionAPIOutput[]
}
