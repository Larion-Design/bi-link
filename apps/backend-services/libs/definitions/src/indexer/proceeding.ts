import { z } from 'zod'
import { proceedingSchema } from 'defs'
import { connectedCompanyIndexSchema, connectedPersonIndexSchema } from './connectedEntity'
import { embeddedFileIndexSchema } from './file'
import { customFieldIndexSchema } from './customField'

export const proceedingIndexSchema = proceedingSchema
  .pick({ name: true, type: true, description: true })
  .merge(
    z.object({
      fileNumber: proceedingSchema.shape.fileNumber.shape.value,
      year: proceedingSchema.shape.year.shape.value,
      customFields: customFieldIndexSchema.array(),
      files: embeddedFileIndexSchema.array(),
      companies: connectedCompanyIndexSchema.array(),
      persons: connectedPersonIndexSchema.array(),
    }),
  )

export const embeddedProceedingSchema = proceedingSchema.pick({ _id: true }).merge(
  proceedingIndexSchema.pick({
    name: true,
    fileNumber: true,
    description: true,
    year: true,
  }),
)

export type ProceedingIndex = z.infer<typeof proceedingIndexSchema>
export type EmbeddedProceedingIndex = z.infer<typeof embeddedProceedingSchema>
