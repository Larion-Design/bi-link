import { z } from 'zod'
import {
  activityEventInputSchema,
  activityEventSchema,
  companyListRecordSchema,
  entityInfoSchema,
  entityTypeSchema,
  eventListRecordSchema,
  personListRecordSchema,
  proceedingListRecord,
  propertyListRecordSchema,
} from 'defs'

export const indexerInterfaceSchema = z.object({
  search: z
    .function()
    .args(
      z.object({
        entityType: entityTypeSchema,
        searchTerm: z.string(),
        limit: z.number(),
        skip: z.number(),
      }),
    )
    .returns(
      z.object({
        total: z.number(),
        records: z.union([
          personListRecordSchema,
          companyListRecordSchema,
          propertyListRecordSchema,
          proceedingListRecord,
          eventListRecordSchema,
        ]),
      }),
    ),

  indexEntity: z.function().args(entityInfoSchema),
  reindexEntities: z.function().args(entityTypeSchema),
  createMapping: z.function().args(z.union([entityTypeSchema, z.literal('ACTIVITY_EVENT')])),
  recordHistoryEvent: z.function().args(activityEventInputSchema),

  personCNPExists: z
    .function()
    .args(
      z.object({
        cnp: z.string(),
        personId: z.string().uuid().optional(),
      }),
    )
    .returns(z.boolean()),

  personIdDocumentExists: z
    .function()
    .args(
      z.object({
        documentNumber: z.string(),
        personId: z.string().uuid().optional(),
      }),
    )
    .returns(z.boolean()),

  companyCUIExists: z
    .function()
    .args(
      z.object({
        cui: z.string(),
        companyId: z.string().uuid().optional(),
      }),
    )
    .returns(z.boolean()),

  companyRegistrationNumberExists: z
    .function()
    .args(
      z.object({
        registrationNumber: z.string(),
        companyId: z.string().uuid().optional(),
      }),
    )
    .returns(z.boolean()),

  vehicleVINExists: z
    .function()
    .args(
      z.object({
        vin: z.string(),
        propertyId: z.string().uuid().optional(),
      }),
    )
    .returns(z.boolean()),

  getActivityHistory: z
    .function()
    .args(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .returns(activityEventSchema.array()),

  getFileContent: z.function().args(z.string().nonempty()).returns(z.string()),
})

export type IndexerServiceMethods = z.infer<typeof indexerInterfaceSchema>
