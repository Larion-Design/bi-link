import { z } from 'zod'
import { graphRelationshipMetadataSchema, personSchema } from 'defs'

export const personGraphSchema = z
  .object({
    cnp: personSchema.shape.cnp.shape.value,
    firstName: personSchema.shape.firstName.shape.value,
    lastName: personSchema.shape.lastName.shape.value,
    documents: z.string().array(),
  })
  .merge(graphRelationshipMetadataSchema)
  .merge(personSchema.pick({ _id: true }))

export type PersonGraphNode = z.infer<typeof personGraphSchema>
