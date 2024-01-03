import { z } from 'zod'
import { withTimestamps } from '../../timestamps'
import { nonEmptyString } from '../helperTypes'

export const baseView = z
  .object({
    name: nonEmptyString,
    type: nonEmptyString,
  })
  .merge(withTimestamps)

export type BaseView = z.infer<typeof baseView>
