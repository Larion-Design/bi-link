import { z } from 'zod'
import { balanceSheetSchema } from 'defs'

export const balanceSheetIndex = balanceSheetSchema.omit({ metadata: true })
export type BalanceSheetIndex = z.infer<typeof balanceSheetIndex>
