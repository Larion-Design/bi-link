import { z } from 'zod'
import { graphCompanyAssociateSchema } from './companyAssociateRelationship'
import { graphEventParticipantSchema } from './eventParticipantRelationship'
import { nodesRelationshipSchema } from './graphBaseRelationship'
import { graphPersonalRelationship } from './personalRelationship'
import { graphProceedingEntitySchema } from './proceedingEntityRelationship'
import { graphPropertyOwnerSchema } from './propertyOwnerRelationship'

const nodesRelationship = nodesRelationshipSchema.array()

export const graphRelationshipsSchema = z.object({
  companiesAssociates: graphCompanyAssociateSchema.array(),
  eventsParties: graphEventParticipantSchema.array(),
  personalRelationships: graphPersonalRelationship.array(),
  propertiesLocation: nodesRelationship,
  companiesHeadquarters: nodesRelationship,
  companiesBranches: nodesRelationship,
  personsBirthPlace: nodesRelationship,
  personsHomeAddress: nodesRelationship,
  eventsOccurrencePlace: nodesRelationship,
  propertiesRelationships: graphPropertyOwnerSchema.array(),
  entitiesReported: nodesRelationship,
  entitiesInvolvedInProceeding: graphProceedingEntitySchema.array(),
  companiesSuppliers: nodesRelationship,
  personsSuppliers: nodesRelationship,
  companiesDisputing: nodesRelationship,
  personsDisputing: nodesRelationship,
  companiesCompetitors: nodesRelationship,
  personsCompetitors: nodesRelationship,
})

export type GraphRelationships = z.infer<typeof graphRelationshipsSchema>
