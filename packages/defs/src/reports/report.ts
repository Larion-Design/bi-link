import { z } from 'zod'
import { dateSchema } from '../date'
import { nodesRelationshipSchema } from '../graphRelationships'
import { withTimestamps } from '../modelTimestamps'
import { dataRefAPISchema, dataRefSchema } from './dataRef'
import { reportSectionAPIOutputSchema, reportSectionSchema } from './reportSection'
import { connectedEntitySchema } from '../connectedEntity'

export const reportSchema = z
  .object({
    _id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    isTemplate: z.boolean(),
    company: connectedEntitySchema.nullish(),
    person: connectedEntitySchema.nullish(),
    event: connectedEntitySchema.nullish(),
    property: connectedEntitySchema.nullish(),
    proceeding: connectedEntitySchema.nullish(),
    sections: reportSectionSchema.array(),
    createdAt: dateSchema,
    updatedAt: dateSchema,
    refs: dataRefSchema.array(),
  })
  .merge(withTimestamps)

const reportAPISchema = reportSchema.merge(
  z.object({
    person: connectedEntitySchema.nullish(),
    company: connectedEntitySchema.nullish(),
    event: connectedEntitySchema.nullish(),
    property: connectedEntitySchema.nullish(),
    proceeding: connectedEntitySchema.nullish(),
    refs: z.array(dataRefAPISchema),
  }),
)

export const reportAPIOutputSchema = reportAPISchema.merge(
  z.object({
    sections: z.array(reportSectionAPIOutputSchema),
  }),
)

export const reportAPIInputSchema = reportAPISchema.omit({
  _id: true,
})

export const reportListRecordSchema = reportAPISchema.pick({ _id: true, name: true, type: true })

export type Report = z.infer<typeof reportSchema>
export type ReportAPIInput = z.infer<typeof reportAPIInputSchema>
export type ReportAPIOutput = z.infer<typeof reportAPIOutputSchema>
export type ReportListRecord = z.infer<typeof reportListRecordSchema>

export type ReportedEntityRelationship = z.infer<typeof nodesRelationshipSchema>
