import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { optionalDateWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { nodesRelationshipSchema } from '../graphRelationships'
import { fileOutputSchema, fileSchema } from '../file'
import { locationSchema } from '../geolocation'
import { withMetadataSchema } from '../metadata'
import { SearchSuggestions } from '../searchSuggestions'
import { eventParticipantAPISchema, eventParticipantSchema } from './party'

export const eventSchema = withMetadataSchema.merge(
  z.object({
    _id: z.string(),
    type: textWithMetadataSchema,
    date: optionalDateWithMetadataSchema,
    location: locationSchema.nullable(),
    description: z.string(),
    parties: z.array(eventParticipantSchema),
    customFields: z.array(customFieldSchema),
    files: z.array(fileSchema),
  }),
)

export const eventAPIInputSchema = eventSchema.omit({ _id: true, parties: true }).merge(
  z.object({
    parties: z.array(eventParticipantAPISchema),
  }),
)

export const eventAPIOutputSchema = eventSchema.omit({ files: true, parties: true }).merge(
  z.object({
    files: z.array(fileOutputSchema),
    parties: z.array(eventParticipantAPISchema),
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
