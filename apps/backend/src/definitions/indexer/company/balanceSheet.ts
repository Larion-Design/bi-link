import { BalanceSheet, balanceSheetSchema } from 'defs'

export const balanceSheetIndex = balanceSheetSchema.omit({
  _id: true,
  metadata: true,
})

export type BalanceSheetIndex = Omit<BalanceSheet, '_id' | 'metadata'>
