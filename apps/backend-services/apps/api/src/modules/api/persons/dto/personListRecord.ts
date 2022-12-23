import { Field, ObjectType } from '@nestjs/graphql'
import { PersonListRecord as PersonListRecordType } from '@app/definitions/person'

@ObjectType()
export class PersonListRecord implements PersonListRecordType {
  @Field()
  _id: string

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  cnp: string
}
