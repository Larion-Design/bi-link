import { z } from 'zod'
import { optionalDateWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { withMetadataSchema } from '../metadata'

export const idDocumentStatusType = z.enum(['VALID', 'EXPIRED', 'LOST_OR_STOLEN']).default('VALID')

export const idDocumentStatusSchema = withMetadataSchema.merge(
  z.object({
    value: idDocumentStatusType,
  }),
)

export const idDocumentSchema = withMetadataSchema.merge(
  z.object({
    documentType: z.string(),
    documentNumber: textWithMetadataSchema,
    issueDate: optionalDateWithMetadataSchema,
    expirationDate: optionalDateWithMetadataSchema,
    status: idDocumentStatusSchema,
  }),
)

export type IdDocumentStatus = z.infer<typeof idDocumentStatusSchema>
export type IdDocumentStatusType = z.infer<typeof idDocumentStatusType>
export type IdDocument = z.infer<typeof idDocumentSchema>
export type IdDocumentAPI = IdDocument
