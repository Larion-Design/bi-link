import { z } from 'zod'
import { withMetadataSchema } from './metadata'

export const textWithMetadataSchema = withMetadataSchema.merge(
  z.object({
    value: z.string(),
  }),
)

export const numberWithMetadataSchema = withMetadataSchema.merge(
  z.object({
    value: z.number(),
  }),
)

export const dateWithMetadataSchema = withMetadataSchema.merge(
  z.object({
    value: z.date().or(z.string()),
  }),
)

export const optionalDateWithMetadataSchema = withMetadataSchema.merge(
  z.object({
    value: z.date().or(z.string()).nullish(),
  }),
)

export const booleanWithMetadataSchema = withMetadataSchema.merge(
  z.object({
    value: z.boolean(),
  }),
)
