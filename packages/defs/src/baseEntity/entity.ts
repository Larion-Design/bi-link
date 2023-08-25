import { z } from 'zod'
import { withTimestamps } from '../timestamps'
import {
  dateField,
  dateRangeField,
  entityIdField,
  geoCoordinatesField,
  numberField,
  numberRangeField,
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
        dateRangeField,
        numberRangeField,
        geoCoordinatesField,
        relationshipField,
        relationshipGroupField,
      ])
      .array(),
  })
  .merge(withTimestamps)

export type Entity = z.infer<typeof entitySchema>
