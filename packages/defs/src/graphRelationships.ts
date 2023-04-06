import { z } from 'zod'
import { companyAPIOutputSchema, graphCompanyAssociateSchema } from './company'
import { entityInfoSchema } from './entity'
import { eventAPIOutputSchema, graphEventParticipantSchema } from './event'
import { locationSchema } from './geolocation'
import { graphPersonalRelationship, personAPIOutputSchema } from './person'
import { graphProceedingEntitySchema, proceedingAPIOutputSchema } from './proceeding'
import { graphPropertyOwnerSchema, propertyAPIOutputSchema } from './property'
import { reportAPIOutputSchema } from './reports'

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
    startNode: entityInfoSchema,
    endNode: entityInfoSchema,
    _type: graphRelationshipSchema,
  }),
)

export const graphRelationshipsSchema = z.object({
  companiesAssociates: graphCompanyAssociateSchema.array(),
  eventsParties: graphEventParticipantSchema.array(),
  personalRelationships: graphPersonalRelationship.array(),
  propertiesLocation: nodesRelationshipSchema.array(),
  companiesHeadquarters: nodesRelationshipSchema.array(),
  companiesBranches: nodesRelationshipSchema.array(),
  personsBirthPlace: nodesRelationshipSchema.array(),
  personsHomeAddress: nodesRelationshipSchema.array(),
  eventsOccurrencePlace: nodesRelationshipSchema.array(),
  propertiesRelationships: graphPropertyOwnerSchema.array(),
  entitiesReported: nodesRelationshipSchema.array(),
  entitiesInvolvedInProceeding: graphProceedingEntitySchema.array(),
})

export const graphEntitiesSchema = z.object({
  companies: companyAPIOutputSchema.array(),
  persons: personAPIOutputSchema.array(),
  properties: propertyAPIOutputSchema.array(),
  events: eventAPIOutputSchema.array(),
  locations: locationSchema.array(),
  proceedings: proceedingAPIOutputSchema.array(),
  reports: reportAPIOutputSchema.array(),
})

export const graphSchema = z.object({
  relationships: graphRelationshipsSchema,
  entities: graphEntitiesSchema,
})

export type GraphNode = z.infer<typeof entityInfoSchema>
export type Graph = z.infer<typeof graphSchema>
export type GraphRelationships = z.infer<typeof graphRelationshipsSchema>
export type GraphEntities = z.infer<typeof graphEntitiesSchema>

export type GraphRelationship = z.infer<typeof graphRelationshipSchema>
export type EntityMetadata = z.infer<typeof nodeMetadataSchema>
export type RelationshipMetadata = z.infer<typeof graphRelationshipMetadataSchema>
export type NodesRelationship = z.infer<typeof nodesRelationshipSchema>
