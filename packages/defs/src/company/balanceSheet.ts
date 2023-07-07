import { z } from 'zod'
import { withMetadataSchema } from '../metadata'

const defaultZero = z.number().default(0)

export const balanceSheetSchema = z
  .object({
    _id: z.string().optional(),
    year: z.date().nullable(),
    fixedAssets: defaultZero,
    currentAssets: defaultZero,
    inventories: defaultZero,
    receivables: defaultZero,
    houseAndAccountsSeizedByBanks: defaultZero,
    expensesAdvance: defaultZero,
    debt: defaultZero,
    revenueAdvance: defaultZero,
    provisions: defaultZero,
    totalCapital: defaultZero,
    socialCapital: defaultZero,
    royaltyHeritage: defaultZero,
    publicHeritage: defaultZero,
    netBusinessFigure: defaultZero,
    totalRevenue: defaultZero,
    totalExpenses: defaultZero,
    grossProfit: defaultZero,
    grossLoss: defaultZero,
    netProfit: defaultZero,
    netLoss: defaultZero,
    averageEmployees: z.number(),
    activityCode: z.number(),
    activityType: z.string(),
    balanceType: z.string().nullable(),
  })
  .merge(withMetadataSchema)

export type BalanceSheet = z.infer<typeof balanceSheetSchema>
