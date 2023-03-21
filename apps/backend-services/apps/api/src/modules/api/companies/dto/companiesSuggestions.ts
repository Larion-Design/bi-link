import { Field, Int, ObjectType, PickType } from '@nestjs/graphql'
import { Suggestions } from '../../common/dto/suggestions'
import { CompanyListRecord } from './companyListRecord'

@ObjectType()
export class CompaniesSuggestions extends PickType(Suggestions, ['total'] as const) {
  @Field(() => [CompanyListRecord])
  records: CompanyListRecord[]
}
