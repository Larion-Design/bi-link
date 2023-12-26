import { CompanyListRecord as CompanyListRecordType } from 'defs'
import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { Company } from './company'

@ObjectType()
export class CompanyListRecord
  extends PickType(Company, ['_id'] as const)
  implements CompanyListRecordType
{
  @Field()
  cui: string

  @Field()
  name: string

  @Field()
  registrationNumber: string
}
