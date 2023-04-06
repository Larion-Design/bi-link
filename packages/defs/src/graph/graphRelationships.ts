import { z } from 'zod'
import { entityInfoSchema } from '../entity'
import { graphCompanyAssociateSchema } from './companyAssociateRelationship'
import { graphEventParticipantSchema } from './eventParticipantRelationship'
import { graphPersonalRelationship } from './personalRelationship'
import { graphProceedingEntitySchema } from './proceedingEntityRelationship'
import { graphPropertyOwnerSchema } from './propertyOwnerRelationship'

export const graphRelationshipTypeSchema = z.enum([
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

export const nodesRelationshipSchema = graphRelationshipMetadataSchema.merge(
  z.object({
    startNode: entityInfoSchema,
    endNode: entityInfoSchema,
    _type: graphRelationshipTypeSchema,
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

export type GraphRelationships = z.infer<typeof graphRelationshipsSchema>
export type GraphRelationship = z.infer<typeof graphRelationshipTypeSchema>
export type RelationshipMetadata = z.infer<typeof graphRelationshipMetadataSchema>
export type NodesRelationship = z.infer<typeof nodesRelationshipSchema>
