import { z } from 'zod'
import { optionalDateWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { withMetadataSchema } from '../metadata'

export const documentStatusSchema = withMetadataSchema.merge(
  z.object({
    value: z.enum(['VALID', 'EXPIRED', 'LOST_OR_STOLEN']).default('VALID'),
  }),
)

export const idDocumentSchema = withMetadataSchema.merge(
  z.object({
    documentType: z.string(),
    documentNumber: textWithMetadataSchema,
    issueDate: optionalDateWithMetadataSchema,
    expirationDate: optionalDateWithMetadataSchema,
    status: documentStatusSchema,
  }),
)

export type IdDocument = z.infer<typeof idDocumentSchema>
export type IdDocumentAPI = IdDocument
