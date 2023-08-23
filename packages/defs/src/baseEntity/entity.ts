import { z } from 'zod'
import { withTimestamps } from '../modelTimestamps'
import {
  dateField,
  entityIdField,
  geoCoordinatesField,
  numberField,
  relationshipField,
  relationshipGroupField,
  textField,
} from './field'

export const entitySchema = z
  .object({
    _id: z.string().nonempty().nullish(),
    name: z.string(),
    type: z.string().nonempty(),
    data: z
      .union([
        entityIdField,
        numberField,
        textField,
        dateField,
        geoCoordinatesField,
        relationshipField,
        relationshipGroupField,
      ])
      .array(),
  })
  .merge(withTimestamps)

export type Entity = z.infer<typeof entitySchema>
