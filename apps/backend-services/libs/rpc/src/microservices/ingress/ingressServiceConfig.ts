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

export const ingressInterfaceSchema = z.object({
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
        entitiesIds: z.string().uuid().array(),
        entitiesType: entityTypeSchema,
        fetchLinkedEntities: z.boolean(),
        source: updateSourceSchema,
      }),
    )
    .returns(entityModelSchema.array()),

  getAllEntities: z.function().args(entityTypeSchema).returns(z.string().uuid().array()),

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
})

export type IngressServiceMethods = z.infer<typeof ingressInterfaceSchema>
export type IngressEntityInputModel = z.infer<typeof entityInputModelSchema>
