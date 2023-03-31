import { z } from 'zod'
import { personIndexSchema, realEstateIndex, vehicleIndexSchema } from '@app/definitions'
import { companySchema, personSchema, propertySchema } from 'defs'

export const connectedPersonIndexSchema = z
  .object({
    _id: personSchema.shape._id,
  })
  .merge(personIndexSchema.pick({ firstName: true, lastName: true, cnp: true }))
  .merge(
    z.object({
      documents: z.string().nonempty().array(),
    }),
  )

export const connectedCompanyIndexSchema = companySchema.pick({ _id: true }).merge(
  z.object({
    name: companySchema.shape.name.shape.value,
    cui: companySchema.shape.cui.shape.value,
    registrationNumber: companySchema.shape.registrationNumber.shape.value,
  }),
)

export const connectedPropertyIndexSchema = propertySchema
  .pick({
    _id: true,
    type: true,
    name: true,
  })
  .merge(
    z.object({
      vehicleInfo: vehicleIndexSchema.optional(),
      realEstateInfo: realEstateIndex.optional(),
    }),
  )

export type ConnectedPersonIndex = z.infer<typeof connectedPersonIndexSchema>
export type ConnectedCompanyIndex = z.infer<typeof connectedCompanyIndexSchema>
export type ConnectedPropertyIndex = z.infer<typeof connectedPropertyIndexSchema>
