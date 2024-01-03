import { z } from 'zod'

export const optionalBoolean = z.boolean().default(false).nullish()
export const nonEmptyString = z.string().nonempty()
export const emptyDefaultString = z.string().default('')
export const nullableDate = z.date().nullable()
export const nullableNumber = z.number().nullable()
export const numberWithDefaultZero = z.number().default(0)
