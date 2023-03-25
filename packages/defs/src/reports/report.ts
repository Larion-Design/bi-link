import { z } from 'zod'
import { companySchema } from '../company'
import { dateSchema } from '../date'
import { nodesRelationshipSchema } from "../graphRelationships";
import { personSchema } from '../person'
import { eventSchema } from '../event'
import { proceedingSchema } from '../proceeding'
import { propertySchema } from '../property'
import { dataRefAPISchema, dataRefSchema } from './dataRef'
import { reportSectionAPIOutputSchema, reportSectionSchema } from './reportSection'
import { connectedEntitySchema } from '../connectedEntity'

export const reportSchema = z.object({
  _id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  isTemplate: z.boolean(),
  company: companySchema.nullish(),
  person: personSchema.nullish(),
  event: eventSchema.nullish(),
  property: propertySchema.nullish(),
  proceeding: proceedingSchema.nullish(),
  sections: z.array(reportSectionSchema),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  refs: z.array(dataRefSchema),
})

export const reportAPIOutputSchema = reportSchema
  .omit({
    sections: true,
    person: true,
    company: true,
    property: true,
    event: true,
    proceeding: true,
    refs: true,
  })
  .merge(
    z.object({
      sections: z.array(reportSectionAPIOutputSchema),
      person: connectedEntitySchema.nullish(),
      company: connectedEntitySchema.nullish(),
      event: connectedEntitySchema.nullish(),
      property: connectedEntitySchema.nullish(),
      proceeding: connectedEntitySchema.nullish(),
      refs: z.array(dataRefAPISchema),
    }),
  )

export const reportAPIInputSchema = reportSchema
  .omit({
    sections: true,
    person: true,
    company: true,
    property: true,
    event: true,
    proceeding: true,
    refs: true,
  })
  .merge(
    z.object({
      sections: z.array(reportSectionSchema),
      person: connectedEntitySchema.nullish(),
      company: connectedEntitySchema.nullish(),
      event: connectedEntitySchema.nullish(),
      property: connectedEntitySchema.nullish(),
      proceeding: connectedEntitySchema.nullish(),
      refs: z.array(dataRefAPISchema),
    }),
  )

export const reportListRecordSchema = reportSchema.pick({ _id: true, name: true, type: true })

export type Report = z.infer<typeof reportSchema>
export type ReportAPIInput = z.infer<typeof reportAPIInputSchema>
export type ReportAPIOutput = z.infer<typeof reportAPIOutputSchema>
export type ReportListRecord = z.infer<typeof reportListRecordSchema>

export type ReportedEntityRelationship = z.infer<typeof nodesRelationshipSchema>
