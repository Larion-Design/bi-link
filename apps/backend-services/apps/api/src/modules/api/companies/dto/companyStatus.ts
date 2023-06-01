import { Field, ObjectType } from '@nestjs/graphql'
import { CompanyStatus as CompanyStatusType } from 'defs'
import { TextValue } from '../../generic/dto/textValue'

@ObjectType()
export class CompanyStatus implements CompanyStatusType {
  @Field(() => TextValue)
  vat: TextValue

  @Field(() => TextValue)
  fiscal: TextValue
}
