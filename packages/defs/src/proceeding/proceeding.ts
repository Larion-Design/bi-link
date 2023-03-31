import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileInputSchema, fileOutputSchema, fileSchema } from '../file'
import { numberWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { withMetadataSchema } from '../metadata'
import { withTimestamps } from '../modelTimestamps'
import { SearchSuggestions } from '../searchSuggestions'
import {
  proceedingEntityInvolvedAPISchema,
  proceedingEntityInvolvedSchema,
} from './proceedingEntityInvolved'

export const proceedingSchema = z
  .object({
    _id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    reason: textWithMetadataSchema,
    year: numberWithMetadataSchema,
    fileNumber: textWithMetadataSchema,
    description: z.string(),
    entitiesInvolved: z.array(proceedingEntityInvolvedSchema),
    customFields: z.array(customFieldSchema),
    files: fileSchema.array(),
  })
  .merge(withMetadataSchema)
  .merge(withTimestamps)

const proceedingAPISchema = proceedingSchema.merge(
  z.object({
    entitiesInvolved: z.array(proceedingEntityInvolvedAPISchema),
  }),
)

export const proceedingAPIInputSchema = proceedingAPISchema.omit({ _id: true }).merge(
  z.object({
    files: fileInputSchema.array(),
  }),
)

export const proceedingAPIOutputSchema = proceedingAPISchema.merge(
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
      year: proceedingAPIOutputSchema.shape.year.shape.value,
      fileNumber: proceedingAPIOutputSchema.shape.fileNumber.shape.value,
    }),
  )

export type Proceeding = z.infer<typeof proceedingSchema>
export type ProceedingAPIInput = z.infer<typeof proceedingAPIInputSchema>
export type ProceedingAPIOutput = z.infer<typeof proceedingAPIOutputSchema>
export type ProceedingListRecord = z.infer<typeof proceedingListRecord>

export interface ProceedingSuggestions extends SearchSuggestions<ProceedingListRecord> {}
