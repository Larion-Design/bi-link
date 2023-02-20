import { ObjectType, PickType } from '@nestjs/graphql'
import { PersonListRecord as PersonListRecordType } from 'defs'
import { Person } from './person'

@ObjectType()
export class PersonListRecord
  extends PickType(Person, ['_id', 'firstName', 'lastName', 'cnp'] as const)
  implements PersonListRecordType {}
