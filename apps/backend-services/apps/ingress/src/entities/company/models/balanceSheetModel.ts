import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BalanceSheet } from 'defs'
import { SchemaTypes } from 'mongoose'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'

@Schema({ _id: false, timestamps: false })
export class BalanceSheetModel implements BalanceSheet {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  activityType: string

  @Prop()
  averageEmployees: number

  @Prop()
  balanceType: string

  @Prop()
  caenCode: number

  @Prop()
  creante: number

  @Prop()
  currentAssets: number

  @Prop()
  debt: number

  @Prop()
  expensesAdvance: number

  @Prop()
  fixedAssets: number

  @Prop()
  grossLoss: number

  @Prop()
  grossProfit: number

  @Prop()
  houseAndAccountsSeizedByBanks: number

  @Prop()
  inventories: number

  @Prop()
  netBusinessFigure: number

  @Prop()
  netLoss: number

  @Prop()
  netProfit: number

  @Prop()
  provisions: number

  @Prop()
  publicHeritage: number

  @Prop()
  revenueAdvance: number

  @Prop()
  royaltyHeritage: number

  @Prop()
  socialCapital: number

  @Prop()
  totalCapital: number

  @Prop()
  totalExpenses: number

  @Prop()
  totalRevenue: number

  @Prop({ type: SchemaTypes.Date, default: null })
  year: Date | null
}

export const BalanceSheetSchema = SchemaFactory.createForClass(BalanceSheetModel)
