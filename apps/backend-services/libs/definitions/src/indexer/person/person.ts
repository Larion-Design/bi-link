import { z } from 'zod'
import { personSchema } from 'defs'
import { educationIndexSchema } from './education'
import { idDocumentIndexSchema } from './idDocument'
import { oldNameIndexSchema } from './oldName'
import { locationIndexSchema } from '../location'
import { embeddedFileIndexSchema } from '../file'
import { customFieldIndexSchema } from '../customField'

export const personIndexSchema = z.object({
  firstName: personSchema.shape.firstName.shape.value,
  lastName: personSchema.shape.firstName.shape.value,
  cnp: personSchema.shape.firstName.shape.value,
  contactDetails: customFieldIndexSchema.array(),
  customFields: customFieldIndexSchema.array(),
  documents: idDocumentIndexSchema.array(),
  birthdate: z.string().optional(),
  oldNames: oldNameIndexSchema.array(),
  files: embeddedFileIndexSchema.array(),
  birthPlace: locationIndexSchema.optional(),
  homeAddress: locationIndexSchema.optional(),
  education: educationIndexSchema.array(),
})

export const personSearchIndex = personIndexSchema.pick({
  firstName: true,
  lastName: true,
  cnp: true,
})

export type PersonIndex = z.infer<typeof personIndexSchema>
export type PersonSearchIndex = z.infer<typeof personSearchIndex>
