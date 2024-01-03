import { z } from 'zod'
import { withSnapshotSchema } from '../snapshot'
import { companySchema } from './company'

export const companySnapshotSchema = withSnapshotSchema.merge(
  z.object({
    entityInfo: companySchema.omit({ _id: true }),
  }),
)

export type CompanySnapshot = z.infer<typeof companySnapshotSchema>
