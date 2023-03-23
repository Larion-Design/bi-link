import { Company } from './company'
import { Event } from './event'
import { Person } from './person'
import { Property } from './property'

export interface ConnectedEntity
  extends NonNullable<Pick<Person | Company | Property | Event, '_id'>> {
  _confirmed?: boolean
}
