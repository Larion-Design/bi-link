import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileInputSchema, fileOutputSchema, fileSchema } from '../file'
import { optionalDateWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { withMetadataSchema } from '../metadata'
import { withTimestamps } from '../modelTimestamps'
import { SearchSuggestions } from '../searchSuggestions'
import { proceedingEntityInvolvedSchema } from './proceedingEntityInvolved'

export const proceedingSchema = z
  .object({
    _id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    status: textWithMetadataSchema,
    reason: textWithMetadataSchema,
    year: optionalDateWithMetadataSchema,
    fileNumber: textWithMetadataSchema,
    description: z.string(),
    entitiesInvolved: proceedingEntityInvolvedSchema.array(),
    customFields: customFieldSchema.array(),
    files: fileSchema.array(),
  })
  .merge(withMetadataSchema)
  .merge(withTimestamps)

export const proceedingAPIInputSchema = proceedingSchema.omit({ _id: true }).merge(
  z.object({
    files: fileInputSchema.array(),
  }),
)

export const proceedingAPIOutputSchema = proceedingSchema.merge(
  z.object({
    files: fileOutputSchema.array(),
  }),
)

export const proceedingListRecord = proceedingSchema
  .pick({
    _id: true,
    name: true,
    type: true,
  })
  .merge(
    z.object({
      status: proceedingAPIOutputSchema.shape.status.shape.value,
      year: proceedingAPIOutputSchema.shape.year.shape.value,
      fileNumber: proceedingAPIOutputSchema.shape.fileNumber.shape.value,
    }),
  )

export type Proceeding = z.infer<typeof proceedingSchema>
export type ProceedingAPIInput = z.infer<typeof proceedingAPIInputSchema>
export type ProceedingAPIOutput = z.infer<typeof proceedingAPIOutputSchema>
export type ProceedingListRecord = z.infer<typeof proceedingListRecord>

export interface ProceedingSuggestions extends SearchSuggestions<ProceedingListRecord> {}
