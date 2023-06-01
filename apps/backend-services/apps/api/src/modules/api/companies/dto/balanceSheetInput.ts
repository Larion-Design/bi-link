import { Field, InputType, PickType } from '@nestjs/graphql'
import { BalanceSheet as BalanceSheetType } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class BalanceSheetInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements BalanceSheetType
{
  @Field(() => Date, { nullable: true })
  year: Date | null

  @Field()
  fixedAssets: number

  @Field()
  currentAssets: number

  @Field()
  inventories: number

  @Field()
  creante: number

  @Field()
  houseAndAccountsSeizedByBanks: number

  @Field()
  expensesAdvance: number

  @Field()
  debt: number

  @Field()
  revenueAdvance: number

  @Field()
  provisions: number

  @Field()
  totalCapital: number

  @Field()
  socialCapital: number

  @Field()
  royaltyHeritage: number

  @Field()
  publicHeritage: number

  @Field()
  netBusinessFigure: number

  @Field()
  totalRevenue: number

  @Field()
  totalExpenses: number

  @Field()
  grossProfit: number

  @Field()
  grossLoss: number

  @Field()
  netProfit: number

  @Field()
  netLoss: number

  @Field()
  averageEmployees: number

  @Field()
  caenCode: number

  @Field()
  activityType: string

  @Field()
  balanceType: string
}
