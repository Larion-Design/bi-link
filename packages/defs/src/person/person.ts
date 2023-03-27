import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileOutputSchema, fileSchema } from '../file'
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

export const personAPIInputSchema = personSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
})

export const personListRecord = personSchema.pick({
  _id: true,
  firstName: true,
  lastName: true,
  cnp: true,
})

export const personListRecordWithImage = personSchema.pick({
  _id: true,
  firstName: true,
  lastName: true,
  cnp: true,
  images: true,
})

export type Person = z.infer<typeof personSchema>
export type PersonListRecord = z.infer<typeof personListRecord>
export type PersonListRecordWithImage = z.infer<typeof personListRecordWithImage>

export interface PersonsSuggestions<T> extends SearchSuggestions<T> {}

export type PersonAPIInput = z.infer<typeof personAPIInputSchema>
export type PersonAPIOutput = z.infer<typeof personAPIOutputSchema>
