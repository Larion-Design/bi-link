import { z } from 'zod'

export const nonEmptyString = z.string().nonempty()
export const emptyString = z.string().default('')
