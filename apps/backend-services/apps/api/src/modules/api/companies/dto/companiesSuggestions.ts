import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CompanyListRecord } from './companyListRecord'

@ObjectType()
export class CompaniesSuggestions {
  @Field(() => [CompanyListRecord])
  records: CompanyListRecord[]

  @Field(() => Int)
  total: number
}
