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

export type TextWithMetadata = z.infer<typeof textWithMetadataSchema>
export type NumberWithMetadata = z.infer<typeof numberWithMetadataSchema>
export type BooleanWithMetadata = z.infer<typeof booleanWithMetadataSchema>
export type DateWithMetadata = z.infer<typeof dateWithMetadataSchema>
export type OptionalDateWithMetadata = z.infer<typeof optionalDateWithMetadataSchema>
