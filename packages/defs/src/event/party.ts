import { z } from 'zod'
import { companySchema } from '../company'
import { connectedEntitySchema } from '../connectedEntity'
import { customFieldSchema } from '../customField'
import { withMetadataSchema } from '../metadata'
import { personSchema } from '../person'
import { propertySchema } from '../property'

export const eventParticipantSchema = z
  .object({
    type: z.string(),
    description: z.string(),
    persons: z.array(personSchema),
    companies: z.array(companySchema),
    properties: z.array(propertySchema),
    customFields: z.array(customFieldSchema),
  })
  .merge(withMetadataSchema)

export const eventParticipantAPISchema = eventParticipantSchema.merge(
  z.object({
    persons: connectedEntitySchema.array(),
    companies: connectedEntitySchema.array(),
    properties: connectedEntitySchema.array(),
  }),
)

export type EventParticipant = z.infer<typeof eventParticipantSchema>
export type EventParticipantAPI = z.infer<typeof eventParticipantAPISchema>
