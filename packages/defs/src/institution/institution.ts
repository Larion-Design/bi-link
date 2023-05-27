import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileInputSchema, fileOutputSchema, fileSchema } from '../file'
import { locationSchema } from '../geolocation'
import { nonEmptyString } from '../helpers'
import { withMetadataSchema } from '../metadata'
import { withTimestamps } from '../modelTimestamps'

export const institutionSchema = z
  .object({
    _id: nonEmptyString,
    name: z.string(),
    type: z.string(),
    location: locationSchema.nullable(),
    contactDetails: customFieldSchema.array(),
    customFields: customFieldSchema.array(),
    files: fileSchema.array(),
  })
  .merge(withTimestamps)
  .merge(withMetadataSchema)

export const institutionInputSchema = institutionSchema
  .omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
  })
  .merge(
    z.object({
      _id: z.string().optional(),
      files: fileInputSchema.array(),
    }),
  )

export const institutionOutputSchema = institutionSchema.merge(
  z.object({
    files: fileOutputSchema.array(),
  }),
)

export type Institution = z.infer<typeof institutionSchema>
export type InstitutionAPIInput = z.infer<typeof institutionInputSchema>
export type InstitutionAPIOutput = z.infer<typeof institutionOutputSchema>
