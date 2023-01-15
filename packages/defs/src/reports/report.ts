import { Company } from '../company'
import { Person } from '../person'
import { Incident } from '../incident'
import { Property } from '../property'
import { ReportSection, ReportSectionAPIInput, ReportSectionAPIOutput } from './reportSection'
import { ConnectedEntity } from '../connectedEntity'

export interface Report {
  _id?: string
  name: string
  type: string
  isTemplate: boolean
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
  extends Omit<
    Required<Report>,
    '_id' | 'sections' | 'person' | 'company' | 'property' | 'incident'
  > {
  person?: ConnectedEntity
  company?: ConnectedEntity
  property?: ConnectedEntity
  incident?: ConnectedEntity
  sections: ReportSectionAPIOutput[]
}
