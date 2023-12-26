import { z } from 'zod'
import parse from 'date-fns/parse'
import { formatDate } from 'tools'

export const termeneDateSchema = z
  .string()
  .nonempty()
  .transform((value) => formatDate(parse(value, 'dd.LL.y', new Date())))
