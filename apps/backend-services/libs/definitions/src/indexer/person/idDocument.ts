import { z } from 'zod'
import { idDocumentSchema } from 'defs'

export const idDocumentIndexSchema = idDocumentSchema
  .pick({ documentNumber: true, status: true })
  .merge(
    z.object({
      validity: z.object({
        gte: idDocumentSchema.shape.issueDate,
        lte: idDocumentSchema.shape.expirationDate,
      }),
    }),
  )

export type IdDocumentIndex = z.infer<typeof idDocumentIndexSchema>
