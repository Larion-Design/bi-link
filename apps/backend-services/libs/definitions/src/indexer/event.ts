import { z } from 'zod'
import { eventSchema } from 'defs'
import {
  connectedCompanyIndexSchema,
  connectedPersonIndexSchema,
  connectedPropertyIndexSchema,
  customFieldIndexSchema,
  embeddedFileIndexSchema,
  locationIndexSchema,
} from '@app/definitions'

export const eventIndexSchema = eventSchema.pick({ location: true, description: true }).merge(
  z.object({
    type: eventSchema.shape.type.shape.value,
    date: eventSchema.shape.date.shape.value,
    location: locationIndexSchema.nullish(),
    files: embeddedFileIndexSchema.array(),
    persons: connectedPersonIndexSchema.array(),
    companies: connectedCompanyIndexSchema.array(),
    properties: connectedPropertyIndexSchema.array(),
    customFields: customFieldIndexSchema.array(),
  }),
)

export const eventSearchIndexSchema = eventIndexSchema.pick({
  date: true,
  location: true,
  type: true,
})

export type EventIndex = z.infer<typeof eventIndexSchema>
export type EventSearchIndex = z.infer<typeof eventSearchIndexSchema>
