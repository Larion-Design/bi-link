import { z } from 'zod'
import { companySchema } from '../company'
import { connectedEntitySchema } from '../connectedEntity'
import { customFieldSchema } from '../customField'
import { withMetadataSchema } from '../metadata'
import { personSchema } from '../person'
import { propertySchema } from '../property'

export const eventParticipantSchema = withMetadataSchema.merge(
  z.object({
    type: z.string(),
    description: z.string(),
    persons: z.array(personSchema),
    companies: z.array(companySchema),
    properties: z.array(propertySchema),
    customFields: z.array(customFieldSchema),
  }),
)

export const eventParticipantAPISchema = eventParticipantSchema
  .omit({
    persons: true,
    companies: true,
    properties: true,
  })
  .merge(
    z.object({
      persons: z.array(connectedEntitySchema),
      companies: z.array(connectedEntitySchema),
      properties: z.array(connectedEntitySchema),
    }),
  )

export type EventParticipant = z.infer<typeof eventParticipantSchema>
export type EventParticipantAPI = z.infer<typeof eventParticipantAPISchema>
