import { CompanyListRecord as CompanyListRecordType } from 'defs'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CompanyListRecord implements CompanyListRecordType {
  @Field()
  _id: string

  @Field()
  cui: string

  @Field()
  name: string

  @Field()
  registrationNumber: string
}
