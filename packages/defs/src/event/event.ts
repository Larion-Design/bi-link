import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { optionalDateWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { nodesRelationshipSchema } from '../graphRelationships'
import { fileInputSchema, fileOutputSchema, fileSchema } from '../file'
import { locationSchema } from '../geolocation'
import { withMetadataSchema } from '../metadata'
import { withTimestamps } from '../modelTimestamps'
import { SearchSuggestions } from '../searchSuggestions'
import { eventParticipantAPISchema, eventParticipantSchema } from './party'

export const eventSchema = z
  .object({
    _id: z.string(),
    type: textWithMetadataSchema,
    date: optionalDateWithMetadataSchema,
    location: locationSchema.nullable(),
    description: z.string(),
    parties: eventParticipantSchema.array(),
    customFields: customFieldSchema.array(),
    files: fileSchema.array(),
  })
  .merge(withMetadataSchema)
  .merge(withTimestamps)

export const eventAPIInputSchema = eventSchema
  .omit({ _id: true, createdAt: true, updatedAt: true })
  .merge(
    z.object({
      files: fileInputSchema.array(),
      parties: eventParticipantAPISchema.array(),
    }),
  )

export const eventAPIOutputSchema = eventSchema.merge(
  z.object({
    files: fileOutputSchema.array(),
    parties: eventParticipantAPISchema.array(),
  }),
)

export const eventListRecordSchema = eventSchema.pick({ _id: true, type: true, date: true }).merge(
  z.object({
    location: z.string().nullish(),
  }),
)

export const graphEventParticipantSchema = nodesRelationshipSchema.merge(
  z.object({
    type: z.string(),
  }),
)

export type Event = z.infer<typeof eventSchema>
export type EventAPIInput = z.infer<typeof eventAPIInputSchema>
export type EventAPIOutput = z.infer<typeof eventAPIOutputSchema>
export type EventListRecord = z.infer<typeof eventListRecordSchema>
export type EventParticipantRelationship = z.infer<typeof graphEventParticipantSchema>

export interface EventsSuggestions extends SearchSuggestions<EventListRecord> {}
