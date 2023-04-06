import {z} from 'zod'
import { entityInfoSchema } from "../entity";

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

export type GraphRelationship = z.infer<typeof graphRelationshipTypeSchema>
export type RelationshipMetadata = z.infer<typeof graphRelationshipMetadataSchema>
export type NodesRelationship = z.infer<typeof nodesRelationshipSchema>