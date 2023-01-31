import { Company, ConnectedEntity, Incident, Person, Property } from '../index'

export interface DataRef {
  _id: string
  person?: Person
  company?: Company
  property?: Property
  incident?: Incident
  path?: string
  targetId?: string
  field: string
}

export interface DataRefAPI extends Omit<DataRef, 'person' | 'company' | 'property' | 'incident'> {
  person?: ConnectedEntity
  company?: ConnectedEntity
  property?: ConnectedEntity
  incident?: ConnectedEntity
}
