import { z } from 'zod'
import { withMetadataSchema } from './metadata'

export const textWithMetadataSchema = z
  .object({
    value: z.string(),
  })
  .merge(withMetadataSchema)

export const numberWithMetadataSchema = z
  .object({
    value: z.number(),
  })
  .merge(withMetadataSchema)

export const dateWithMetadataSchema = z
  .object({
    value: z.date().or(z.string()),
  })
  .merge(withMetadataSchema)

export const optionalDateWithMetadataSchema = z
  .object({
    value: z.date().or(z.string()).nullish(),
  })
  .merge(withMetadataSchema)

export const booleanWithMetadataSchema = z
  .object({
    value: z.boolean(),
  })
  .merge(withMetadataSchema)

export type TextWithMetadata = z.infer<typeof textWithMetadataSchema>
export type NumberWithMetadata = z.infer<typeof numberWithMetadataSchema>
export type BooleanWithMetadata = z.infer<typeof booleanWithMetadataSchema>
export type DateWithMetadata = z.infer<typeof dateWithMetadataSchema>
export type OptionalDateWithMetadata = z.infer<typeof optionalDateWithMetadataSchema>
