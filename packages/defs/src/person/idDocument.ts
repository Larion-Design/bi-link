import { z } from 'zod'
import { dateSchema } from '../date'
import { withMetadataSchema } from '../metadata'

export const idDocumentStatusSchema = z
  .enum(['VALID', 'EXPIRED', 'LOST_OR_STOLEN'])
  .default('VALID')

export const idDocumentSchema = withMetadataSchema.merge(
  z.object({
    documentType: z.string(),
    documentNumber: z.string(),
    issueDate: dateSchema.nullish(),
    expirationDate: dateSchema.nullish(),
    status: idDocumentStatusSchema,
  }),
)

export type IdDocumentStatus = z.infer<typeof idDocumentStatusSchema>
export type IdDocument = z.infer<typeof idDocumentSchema>
export type IdDocumentAPI = IdDocument
