import { z } from 'zod'
import { graphCompanyAssociateSchema } from './companyAssociateRelationship'
import { graphEventParticipantSchema } from './eventParticipantRelationship'
import { nodesRelationshipSchema } from './graphBaseRelationship';
import { graphPersonalRelationship } from './personalRelationship'
import { graphProceedingEntitySchema } from './proceedingEntityRelationship'
import { graphPropertyOwnerSchema } from './propertyOwnerRelationship'

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
