import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileInputSchema, fileOutputSchema, fileSchema } from '../file'
import { optionalDateWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { locationSchema } from '../geolocation'
import { withMetadataSchema } from '../metadata'
import { withTimestamps } from '../modelTimestamps'
import { SearchSuggestions } from '../searchSuggestions'
import { educationSchema } from './education'
import { idDocumentSchema } from './idDocument'
import { oldNameSchema } from './oldName'
import { relationshipSchema } from './relationship'

export const personSchema = z
  .object({
    _id: z.string().uuid(),
    birthdate: optionalDateWithMetadataSchema,
    birthPlace: locationSchema.nullable(),
    firstName: textWithMetadataSchema,
    lastName: textWithMetadataSchema,
    oldNames: oldNameSchema.array(),
    cnp: textWithMetadataSchema,
    homeAddress: locationSchema.nullable(),
    education: educationSchema.array(),
    images: fileSchema.array(),
    documents: idDocumentSchema.array(),
    relationships: relationshipSchema.array(),
    files: fileSchema.array(),
    contactDetails: customFieldSchema.array(),
    customFields: customFieldSchema.array(),
  })
  .merge(withTimestamps)
  .merge(withMetadataSchema)

export const personAPIOutputSchema = personSchema.merge(
  z.object({
    files: fileOutputSchema.array(),
    images: fileOutputSchema.array(),
  }),
)

export const personAPIInputSchema = personSchema
  .omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
  })
  .merge(
    z.object({
      _id: z.string().optional(),
      files: fileInputSchema.array(),
      images: fileInputSchema.array(),
    }),
  )

export const personListRecordSchema = personSchema
  .pick({
    _id: true,
  })
  .merge(
    z.object({
      firstName: personSchema.shape.firstName.shape.value,
      lastName: personSchema.shape.lastName.shape.value,
      cnp: personSchema.shape.cnp.shape.value,
    }),
  )

export const personListRecordWithImage = personListRecordSchema.merge(
  z.object({
    images: personAPIOutputSchema.shape.images,
  }),
)

export const OSINTPersonSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  url: z.string().url(),
  address: z.string().optional(),
})

export type Person = z.infer<typeof personSchema>
export type PersonListRecord = z.infer<typeof personListRecordSchema>
export type PersonListRecordWithImage = z.infer<typeof personListRecordWithImage>

export interface PersonsSuggestions<T> extends SearchSuggestions<T> {}

export type PersonAPIInput = z.infer<typeof personAPIInputSchema>
export type PersonAPIOutput = z.infer<typeof personAPIOutputSchema>
export type OSINTPerson = z.infer<typeof OSINTPersonSchema>
