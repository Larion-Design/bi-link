import { z } from 'zod'
import { eventSchema } from 'defs'
import {
  connectedCompanyIndexSchema,
  connectedPersonIndexSchema,
  connectedPropertyIndexSchema,
} from './connectedEntity'
import { locationIndexSchema } from './location'
import { embeddedFileIndexSchema } from './file'
import { customFieldIndexSchema } from './customField'

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
