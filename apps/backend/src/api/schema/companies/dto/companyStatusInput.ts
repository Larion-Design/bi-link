import { Field, InputType } from '@nestjs/graphql'
import { CompanyStatus as CompanyStatusType } from 'defs'
import { TextValueInput } from '../../generic/dto/textValueInput'

@InputType()
export class CompanyStatusInput implements CompanyStatusType {
  @Field(() => TextValueInput)
  vat: TextValueInput

  @Field(() => TextValueInput)
  fiscal: TextValueInput
}
