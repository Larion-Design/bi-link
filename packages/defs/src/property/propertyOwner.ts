import { z } from 'zod'
import { dateSchema } from '../date'
import { dateWithMetadataSchema, optionalDateWithMetadataSchema } from '../generic'
import { withMetadataSchema } from '../metadata'
import { personSchema } from '../person'
import { companySchema } from '../company'
import { customFieldSchema } from '../customField'
import { connectedEntitySchema } from '../connectedEntity'
import { nodesRelationshipSchema } from '../graphRelationships'

export const vehicleOwnerSchema = z.object({
  plateNumbers: z.array(z.string()),
})

export const propertyOwnerSchema = withMetadataSchema.merge(
  z.object({
    person: personSchema.nullish(),
    company: companySchema.nullish(),
    startDate: optionalDateWithMetadataSchema,
    endDate: optionalDateWithMetadataSchema,
    customFields: z.array(customFieldSchema),
    vehicleOwnerInfo: vehicleOwnerSchema.nullish(),
  }),
)

export const propertyOwnerAPISchema = propertyOwnerSchema
  .omit({ person: true, company: true })
  .merge(
    z.object({
      person: connectedEntitySchema.nullish(),
      company: connectedEntitySchema.nullish(),
    }),
  )

export const graphPropertyOwnerSchema = nodesRelationshipSchema.merge(
  z.object({
    startDate: dateSchema,
    endDate: dateSchema,
  }),
)

export type PropertyOwner = z.infer<typeof propertyOwnerSchema>
export type PropertyOwnerAPI = z.infer<typeof propertyOwnerAPISchema>

export type PropertyOwnerRelationship = z.infer<typeof graphPropertyOwnerSchema>
