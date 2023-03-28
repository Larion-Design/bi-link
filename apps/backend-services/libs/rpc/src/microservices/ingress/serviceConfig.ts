import { z } from 'zod'
import { personAPIInputSchema, personSchema, personSnapshotSchema, updateSourceSchema } from 'defs'

export const personIngressSchema = z.object({
  getPerson: z
    .function()
    .args(z.object({ personId: z.string().uuid(), fetchLinkedEntities: z.boolean() }))
    .returns(personSchema),

  getPersons: z
    .function()
    .args(
      z.object({
        personsIds: z.string().uuid().array(),
        fetchLinkedEntities: z.boolean(),
      }),
    )
    .returns(personSchema.array()),

  createPerson: z.function().args(personAPIInputSchema).returns(z.string().uuid()),

  updatePerson: z
    .function()
    .args(z.object({ personId: z.string().uuid(), data: personAPIInputSchema }))
    .returns(z.boolean()),

  getPersonSnapshot: z.function().args(z.string().uuid()).returns(personSnapshotSchema),

  getPersonSnapshots: z
    .function()
    .args(z.string().uuid().array())
    .returns(personSnapshotSchema.array()),

  getAllPersonSnapshots: z.function().args(z.string().uuid()).returns(personSnapshotSchema.array()),

  createPersonPendingSnapshot: z
    .function()
    .args(
      z.object({
        personId: z.string().uuid(),
        data: personAPIInputSchema,
        source: updateSourceSchema,
      }),
    )
    .returns(z.string().uuid()),

  createPersonHistorySnapshot: z
    .function()
    .args(
      z.object({
        personId: z.string().uuid(),
        source: updateSourceSchema,
      }),
    )
    .returns(z.string().uuid()),

  applyPersonSnapshot: z.function().args(z.string().uuid()).returns(z.boolean()),
})

export type PersonIngressMethods = z.infer<typeof personIngressSchema>

export const ingressServiceConfig = {
  id: 'INGRESS',
  persons: {
    getPerson: 'getPerson',
    getPersons: 'getPersons',
    createPerson: 'createPerson',
    updatePerson: 'updatePerson',
    getPersonSnapshot: 'getPersonSnapshot',
    getPersonSnapshots: 'getPersonSnapshots',
    getAllPersonSnapshots: 'getAllPersonSnapshots',
    createPersonPendingSnapshot: 'createPersonPendingSnapshot',
    createPersonHistorySnapshot: 'createPersonHistorySnapshot',
    applyPersonSnapshot: 'applyPersonSnapshot',
  },
  companies: {
    getCompany: 'getCompany',
    getCompanies: 'getCompanies',
    createCompany: 'createCompany',
    updateCompany: 'updateCompany',
    getCompanySnapshot: 'getCompanySnapshot',
    getCompanySnapshots: 'getCompanySnapshots',
    getAllCompanySnapshots: 'getAllCompanySnapshots',
    createCompanyPendingSnapshot: 'createCompanyPendingSnapshot',
    createCompanyHistorySnapshot: 'createCompanyHistorySnapshot',
    applyCompanySnapshot: 'applyCompanySnapshot',
  },
  property: {
    getProperty: 'getProperty',
    getProperties: 'getProperties',
    createProperty: 'createProperty',
    updateProperty: 'updateProperty',
    getPropertySnapshot: 'getPropertySnapshot',
    getPropertySnapshots: 'getPropertySnapshots',
    getAllPropertySnapshots: 'getAllPropertySnapshots',
    createPropertyPendingSnapshot: 'createPropertyPendingSnapshot',
    createPropertyHistorySnapshot: 'createPropertyHistorySnapshot',
    applyPropertySnapshot: 'applyPropertySnapshot',
  },
  event: {
    getEvent: 'getEvent',
    getEvents: 'getEvents',
    createEvent: 'createEvent',
    updateEvent: 'updateEvent',
    getEventSnapshot: 'getEventSnapshot',
    getEventSnapshots: 'getEventSnapshots',
    getAllEventSnapshots: 'getAllEventSnapshots',
    createEventPendingSnapshot: 'createEventPendingSnapshot',
    createEventHistorySnapshot: 'createEventHistorySnapshot',
    applyEventSnapshot: 'applyEventSnapshot',
  },
  report: {
    getReport: 'getReport',
    getReports: 'getReports',
    createReport: 'createReport',
    updateReport: 'updateReport',
    getReportSnapshot: 'getReportSnapshot',
    getReportSnapshots: 'getReportSnapshots',
    getAllReportSnapshots: 'getAllReportSnapshots',
    createReportPendingSnapshot: 'createReportPendingSnapshot',
    createReportHistorySnapshot: 'createReportHistorySnapshot',
    applyReportSnapshot: 'applyReportSnapshot',
  },
  proceeding: {
    getProceeding: 'getProceeding',
    getProceedings: 'getProceedings',
    createProceeding: 'createProceeding',
    updateProceeding: 'updateProceeding',
    getProceedingSnapshot: 'getProceedingSnapshot',
    getProceedingSnapshots: 'getProceedingSnapshots',
    getAllProceedingSnapshots: 'getAllProceedingSnapshots',
    createProceedingPendingSnapshot: 'createProceedingPendingSnapshot',
    createProceedingHistorySnapshot: 'createProceedingHistorySnapshot',
    applyProceedingSnapshot: 'applyProceedingSnapshot',
  },
  files: {
    getFile: 'getFile',
    getFiles: 'getFiles',
    createFile: 'createFile',
    updateFile: 'updateFile',
    updateFiles: 'updateFiles',
  },
}
