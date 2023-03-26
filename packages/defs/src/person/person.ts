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
import { relationshipAPISchema, relationshipSchema } from './relationship'

export const personSchema = z
  .object({
    _id: z.string().uuid(),
    birthdate: optionalDateWithMetadataSchema,
    birthPlace: locationSchema.nullable(),
    firstName: textWithMetadataSchema,
    lastName: textWithMetadataSchema,
    oldNames: z.array(oldNameSchema),
    cnp: textWithMetadataSchema,
    homeAddress: locationSchema.nullable(),
    education: z.array(educationSchema),
    images: z.array(fileSchema),
    documents: z.array(idDocumentSchema),
    relationships: z.array(relationshipSchema),
    files: z.array(fileSchema),
    contactDetails: z.array(customFieldSchema),
    customFields: z.array(customFieldSchema),
  })
  .merge(withTimestamps)
  .merge(withMetadataSchema)

const personAPISchema = personSchema.merge(
  z.object({
    relationships: z.array(relationshipAPISchema),
  }),
)

export const personAPIOutputSchema = personAPISchema.merge(
  z.object({
    files: z.array(fileOutputSchema),
    images: z.array(fileOutputSchema),
  }),
)

export const personAPIInputSchema = personAPISchema.omit({
  _id: true,
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
