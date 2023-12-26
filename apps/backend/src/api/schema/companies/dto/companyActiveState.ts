import { Field, ObjectType } from '@nestjs/graphql'
import { CompanyActiveState as CompanyActiveStateType } from 'defs'
import { BooleanValue } from '../../generic/dto/booleanValue'

@ObjectType()
export class CompanyActiveState implements CompanyActiveStateType {
  @Field(() => BooleanValue)
  ministryOfFinance: BooleanValue

  @Field(() => BooleanValue)
  tradeRegister: BooleanValue
}
