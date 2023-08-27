import { z } from 'zod'
import { dateField } from './date'
import { dateRangeField } from './dateRange'
import { enumField } from './enum'
import { geoCoordinatesField } from './geoCoordinates'
import { numberField } from './number'
import { numberRangeField } from './numberRange'
import { textField } from './text'

export const dataField = z.union([
  numberField,
  textField,
  dateField,
  numberRangeField,
  dateRangeField,
  enumField,
  geoCoordinatesField,
])

export type DataField = z.infer<typeof dataField>
