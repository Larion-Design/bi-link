import { z } from 'zod'

export const proceedingIndexSchema = proceedingSchema
  .pick({ name: true, type: true, description: true })
  .merge(
    z.object({
      fileNumber: proceedingSchema.shape.fileNumber.shape.value,
      year: proceedingSchema.shape.year.shape.value,
      customFields: customFieldIndexSchema.array(),
    }),
  )

import { Proceeding, proceedingSchema } from 'defs'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  customFieldIndexSchema,
  EmbeddedFileIndex,
} from '@app/definitions'

export interface ProceedingIndex
  extends Pick<
    Proceeding,
    'name' | 'type' | 'fileNumber' | 'description' | 'year' | 'customFields'
  > {
  persons: ConnectedPersonIndex[]
  companies: ConnectedCompanyIndex[]
  files: EmbeddedFileIndex[]
}

export interface EmbeddedProceedingIndex
  extends Pick<Proceeding, '_id' | 'name' | 'fileNumber' | 'description' | 'year'> {}
