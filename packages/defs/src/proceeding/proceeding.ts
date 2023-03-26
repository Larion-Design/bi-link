import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileOutputSchema, fileSchema } from '../file'
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
    files: z.array(fileSchema),
  })
  .merge(withMetadataSchema)
  .merge(withTimestamps)

const proceedingAPISchema = proceedingSchema.merge(
  z.object({
    entitiesInvolved: z.array(proceedingEntityInvolvedAPISchema),
  }),
)

export const proceedingAPIInputSchema = proceedingAPISchema.omit({ _id: true })

export const proceedingAPIOutputSchema = proceedingAPISchema.merge(
  z.object({
    files: z.array(fileOutputSchema),
  }),
)

export const proceedingListRecord = proceedingSchema.pick({
  _id: true,
  name: true,
  type: true,
  year: true,
  fileNumber: true,
})

export type Proceeding = z.infer<typeof proceedingSchema>
export type ProceedingAPIInput = z.infer<typeof proceedingAPIInputSchema>
export type ProceedingAPIOutput = z.infer<typeof proceedingAPIOutputSchema>
export type ProceedingListRecord = z.infer<typeof proceedingListRecord>

export interface ProceedingSuggestions extends SearchSuggestions<ProceedingListRecord> {}
