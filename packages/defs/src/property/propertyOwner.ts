import { z } from 'zod'
import { optionalDateWithMetadataSchema } from '../generic'
import { withMetadataSchema } from '../metadata'
import { personSchema } from '../person'
import { companySchema } from '../company'
import { customFieldSchema } from '../customField'
import { connectedEntitySchema } from '../connectedEntity'

export const vehicleOwnerSchema = z.object({
  plateNumbers: z.string().nonempty().array(),
})

export const propertyOwnerSchema = z
  .object({
    person: personSchema.nullish(),
    company: companySchema.nullish(),
    startDate: optionalDateWithMetadataSchema,
    endDate: optionalDateWithMetadataSchema,
    customFields: customFieldSchema.array(),
    vehicleOwnerInfo: vehicleOwnerSchema.nullish(),
  })
  .merge(withMetadataSchema)

export const propertyOwnerAPISchema = propertyOwnerSchema.merge(
  z.object({
    person: connectedEntitySchema.nullish(),
    company: connectedEntitySchema.nullish(),
  }),
)

export type PropertyOwner = z.infer<typeof propertyOwnerSchema>
export type PropertyOwnerAPI = z.infer<typeof propertyOwnerAPISchema>
export type VehicleOwnerInfo = z.infer<typeof vehicleOwnerSchema>
