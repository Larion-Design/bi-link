import { z } from 'zod'
import { nodeMetadataSchema, proceedingSchema } from 'defs'

export const proceedingGraphSchema = proceedingSchema.pick({ name: true, type: true }).merge(
  z
    .object({
      year: proceedingSchema.shape.year.shape.value,
      fileNumber: proceedingSchema.shape.fileNumber.shape.value,
    })
    .merge(nodeMetadataSchema),
)

export type ProceedingGraphNode = z.infer<typeof proceedingGraphSchema>
