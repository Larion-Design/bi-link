import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { PersonListRecord as PersonListRecordType } from 'defs'
import { Person } from './person'

@ObjectType()
export class PersonListRecord
  extends PickType(Person, ['_id'] as const)
  implements PersonListRecordType
{
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  cnp: string
}
