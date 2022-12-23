import { CompanyListRecord as CompanyListRecordType } from '@app/definitions/company'
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
