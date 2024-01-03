import { Field, InputType } from '@nestjs/graphql'
import { CompanyActiveState as CompanyActiveStateType } from 'defs'
import { BooleanValueInput } from '../../generic/dto/booleanValueInput'

@InputType()
export class CompanyActiveStateInput implements CompanyActiveStateType {
  @Field(() => BooleanValueInput)
  ministryOfFinance: BooleanValueInput

  @Field(() => BooleanValueInput)
  tradeRegister: BooleanValueInput
}
