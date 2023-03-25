import { z } from 'zod'
import { companyListRecordSchema, graphCompanyAssociateSchema } from './company'
import { entityTypeSchema } from './entity'
import { eventListRecordSchema, graphEventParticipantSchema } from './event'
import { locationSchema } from './geolocation'
import { graphPersonalRelationship, personListRecordWithImage } from './person'
import { graphProceedingEntitySchema, proceedingListRecord } from './proceeding'
import { graphPropertyOwnerSchema, propertyListRecordSchema } from './property'
import { reportListRecordSchema } from './reports'

export const graphRelationshipSchema = z.enum([
  'RELATED',
  'BORN_IN',
  'LIVES_AT',
  'ASSOCIATE',
  'OWNER',
  'PARTY_INVOLVED',
  'HAS_ATTACHMENT',
  'HQ_AT',
  'BRANCH_AT',
  'OCCURED_AT',
  'LOCATED_AT',
  'INVOLVED_AS',
  'REPORTED',
  'MENTIONED',
])

export const graphRelationshipMetadataSchema = z.object({
  _confirmed: z.boolean().default(true),
  _trustworthiness: z.number().default(3),
})

export const nodeMetadataSchema = z.object({
  _id: z.string(),
})

export const nodesRelationshipSchema = graphRelationshipMetadataSchema.merge(
  z.object({
    startNode: entityTypeSchema,
    endNode: entityTypeSchema,
    _type: graphRelationshipSchema,
  }),
)

export type GraphNode = z.infer<typeof entityTypeSchema>

export const graphRelationshipsSchema = z.object({
  companiesAssociates: z.array(graphCompanyAssociateSchema),
  eventsParties: z.array(graphEventParticipantSchema),
  personalRelationships: z.array(graphPersonalRelationship),
  propertiesLocation: z.array(nodesRelationshipSchema),
  companiesHeadquarters: z.array(nodesRelationshipSchema),
  companiesBranches: z.array(nodesRelationshipSchema),
  personsBirthPlace: z.array(nodesRelationshipSchema),
  personsHomeAddress: z.array(nodesRelationshipSchema),
  eventsOccurrencePlace: z.array(nodesRelationshipSchema),
  propertiesRelationships: z.array(graphPropertyOwnerSchema),
  entitiesReported: z.array(nodesRelationshipSchema),
  entitiesInvolvedInProceeding: z.array(graphProceedingEntitySchema),
})

export const graphEntitiesSchema = z.object({
  companies: z.array(companyListRecordSchema),
  persons: z.array(personListRecordWithImage),
  properties: z.array(propertyListRecordSchema),
  events: z.array(eventListRecordSchema),
  locations: z.array(locationSchema),
  proceedings: z.array(proceedingListRecord),
  reports: z.array(reportListRecordSchema),
})

export const graphSchema = z.object({
  relationships: graphRelationshipsSchema,
  entities: graphEntitiesSchema,
})

export type Graph = z.infer<typeof graphSchema>
export type GraphRelationships = z.infer<typeof graphRelationshipsSchema>
export type GraphEntities = z.infer<typeof graphEntitiesSchema>

export type GraphRelationship = z.infer<typeof graphRelationshipSchema>
export type EntityMetadata = z.infer<typeof nodeMetadataSchema>
export type RelationshipMetadata = z.infer<typeof graphRelationshipMetadataSchema>
export type NodesRelationship = z.infer<typeof nodesRelationshipSchema>
