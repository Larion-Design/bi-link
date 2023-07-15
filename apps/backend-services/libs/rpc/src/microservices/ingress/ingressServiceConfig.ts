import { z } from 'zod'
import {
  companyAPIInputSchema,
  companySchema,
  companySnapshotSchema,
  entityInfoSchema,
  entityTypeSchema,
  eventAPIInputSchema,
  eventSchema,
  eventSnapshotSchema,
  fileInputSchema,
  fileSchema,
  locationSchema,
  personAPIInputSchema,
  personSchema,
  personSnapshotSchema,
  proceedingAPIInputSchema,
  proceedingSchema,
  proceedingSnapshotSchema,
  propertyAPIInputSchema,
  propertySchema,
  propertySnapshotSchema,
  reportAPIInputSchema,
  reportSchema,
  reportSnapshotSchema,
  updateSourceSchema,
} from 'defs'

const entityModelSchema = z.union([
  personSchema,
  companySchema,
  propertySchema,
  proceedingSchema,
  eventSchema,
  fileSchema,
  locationSchema,
  reportSchema,
])

const entityInputModelSchema = z.union([
  personAPIInputSchema,
  companyAPIInputSchema,
  propertyAPIInputSchema,
  proceedingAPIInputSchema,
  eventAPIInputSchema,
  reportAPIInputSchema,
  fileSchema,
  locationSchema,
])

const entitySnapshotModelSchema = z.union([
  personSnapshotSchema,
  companySnapshotSchema,
  propertySnapshotSchema,
  proceedingSnapshotSchema,
  eventSnapshotSchema,
  reportSnapshotSchema,
])

const withAuthor = z.object({ source: updateSourceSchema })

const getEntitySchema = z.function().args(
  withAuthor.merge(
    z.object({
      entityId: z.string().nonempty(),
      fetchLinkedEntities: z.boolean(),
    }),
  ),
)

const getEntitiesSchema = z.function().args(
  withAuthor.merge(
    z.object({
      entitiesIds: z.string().nonempty().array(),
      fetchLinkedEntities: z.boolean(),
    }),
  ),
)

const createEntitySchema = z.function().returns(z.string().nonempty())

export const ingressInterfaceSchema = z.object({
  getPerson: getEntitySchema.returns(personSchema),
  getCompany: getEntitySchema.returns(companySchema),
  getProperty: getEntitySchema.returns(propertySchema),
  getProceeding: getEntitySchema.returns(proceedingSchema),
  getEvent: getEntitySchema.returns(eventSchema),
  getFile: getEntitySchema.returns(fileSchema),
  getReport: getEntitySchema.returns(reportSchema),

  getPersons: getEntitiesSchema.returns(personSchema.array()),
  getCompanies: getEntitySchema.returns(companySchema.array()),
  getProperties: getEntitySchema.returns(propertySchema.array()),
  getProceedings: getEntitySchema.returns(proceedingSchema.array()),
  getEvents: getEntitySchema.returns(eventSchema.array()),
  getFiles: getEntitySchema.returns(fileSchema.array()),
  getReports: getEntitySchema.returns(reportSchema.array()),

  createPerson: createEntitySchema.args(
    withAuthor.merge(z.object({ entityData: personAPIInputSchema })),
  ),

  createCompany: createEntitySchema.args(
    withAuthor.merge(z.object({ entityData: companyAPIInputSchema })),
  ),

  createProperty: createEntitySchema.args(
    withAuthor.merge(z.object({ entityData: propertyAPIInputSchema })),
  ),

  createEvent: createEntitySchema.args(
    withAuthor.merge(z.object({ entityData: eventAPIInputSchema })),
  ),

  createProceeding: createEntitySchema.args(
    withAuthor.merge(z.object({ entityData: proceedingAPIInputSchema })),
  ),

  createReport: createEntitySchema.args(
    withAuthor.merge(z.object({ entityData: reportAPIInputSchema })),
  ),

  createLocation: createEntitySchema.args(
    withAuthor.merge(z.object({ entityData: locationSchema })),
  ),

  createFile: createEntitySchema.args(withAuthor.merge(z.object({ entityData: fileInputSchema }))),

  getEntity: z
    .function()
    .args(
      z.object({
        entityInfo: entityInfoSchema,
        fetchLinkedEntities: z.boolean(),
        source: updateSourceSchema,
      }),
    )
    .returns(entityModelSchema),

  getEntities: z
    .function()
    .args(
      z.object({
        entitiesIds: z.string().nonempty().array(),
        entitiesType: entityTypeSchema,
        fetchLinkedEntities: z.boolean(),
        source: updateSourceSchema,
      }),
    )
    .returns(entityModelSchema.array()),

  getAllEntities: z.function().args(entityTypeSchema).returns(z.string().nonempty().array()),

  createEntity: z
    .function()
    .args(
      z.object({
        entityType: entityTypeSchema,
        entityData: entityInputModelSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(z.string().uuid()),

  updateEntity: z
    .function()
    .args(
      z.object({
        entityInfo: entityInfoSchema,
        entityData: entityInputModelSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(z.boolean()),

  createPendingSnapshot: z
    .function()
    .args(
      z.object({
        entityInfo: entityInfoSchema,
        entityData: entityInputModelSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(z.string().uuid()),

  removePendingSnapshot: z
    .function()
    .args(
      z.object({
        snapshotId: z.string().uuid(),
        entityType: entityTypeSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(z.string().uuid()),

  getPendingSnapshot: z
    .function()
    .args(
      z.object({
        snapshotId: z.string().uuid(),
        entityType: entityTypeSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(entitySnapshotModelSchema),

  getPendingSnapshotsById: z
    .function()
    .args(
      z.object({
        entityType: entityTypeSchema,
        snapshotsIds: z.string().uuid().array(),
        source: updateSourceSchema,
      }),
    )
    .returns(entitySnapshotModelSchema.array()),

  getPendingSnapshotsByEntity: z
    .function()
    .args(
      z.object({
        entityInfo: entityInfoSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(entitySnapshotModelSchema.array()),

  getHistorySnapshot: z
    .function()
    .args(
      z.object({
        snapshotId: z.string().uuid(),
        entityType: entityTypeSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(entitySnapshotModelSchema),

  getHistorySnapshotsById: z
    .function()
    .args(
      z.object({
        entityType: entityTypeSchema,
        snapshotsIds: z.string().uuid().array(),
        source: updateSourceSchema,
      }),
    )
    .returns(entitySnapshotModelSchema.array()),

  getHistorySnapshotsByEntity: z
    .function()
    .args(z.object({ entityInfo: entityInfoSchema, source: updateSourceSchema }))
    .returns(entitySnapshotModelSchema.array()),

  createHistorySnapshot: z
    .function()
    .args(
      z.object({
        entityInfo: entityInfoSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(z.string().uuid()),

  applyPendingSnapshot: z
    .function()
    .args(
      z.object({
        entityInfo: entityInfoSchema,
        snapshotId: z.string().uuid(),
        source: updateSourceSchema,
      }),
    )
    .returns(z.boolean()),

  revertHistorySnapshot: z
    .function()
    .args(
      z.object({
        entityInfo: entityInfoSchema,
        snapshotId: z.string().uuid(),
        source: updateSourceSchema,
      }),
    )
    .returns(z.boolean()),

  getFileByHash: z.function().args(z.string().nonempty()).returns(fileSchema),

  getReportsTemplates: z.function().returns(reportSchema.array()),

  findCompanyId: z
    .function()
    .args(z.record(companySchema.keyof(), z.string().nonempty().nullable()))
    .returns(z.string().nonempty().nullish()),

  findPersonId: z
    .function()
    .args(
      z.object({
        firstName: z.string().nullish(),
        lastName: z.string().nullish(),
        birthdate: z.date().nullish(),
        cnp: z.string().nullish(),
        documentNumber: z.string().nullish(),
        dataSource: z.string().nullish(),
      }),
    )
    .returns(z.string().nonempty().nullish()),

  findProceedingId: z
    .function()
    .args(z.string().nonempty())
    .returns(z.string().nonempty().nullish()),
})

export type IngressServiceMethods = z.infer<typeof ingressInterfaceSchema>
export type IngressEntityInputModel = z.infer<typeof entityInputModelSchema>
