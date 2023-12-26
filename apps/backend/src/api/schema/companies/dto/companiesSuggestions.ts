import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { Suggestions } from '../../search/dto/suggestions'
import { CompanyListRecord } from './companyListRecord'

@ObjectType()
export class CompaniesSuggestions extends PickType(Suggestions, ['total'] as const) {
  @Field(() => [CompanyListRecord])
  records: CompanyListRecord[]
}
