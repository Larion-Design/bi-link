import { Company, ConnectedEntity, Event, Person, Property } from '../index'

export interface DataRef {
  _id: string
  person?: Person
  company?: Company
  property?: Property
  event?: Event
  path?: string
  targetId?: string
  field: string
}

export interface DataRefAPI extends Omit<DataRef, 'person' | 'company' | 'property' | 'event'> {
  person?: ConnectedEntity
  company?: ConnectedEntity
  property?: ConnectedEntity
  event?: ConnectedEntity
}
