import { z } from 'zod'
import { withTimestamps } from '../../timestamps'
import { emptyDefaultString, nonEmptyString, optionalBoolean } from '../helperTypes'

export const fieldType = z.enum([
  'number',
  'text',
  'date',
  'enum',
  'dateRange',
  'numberRange',
  'geoCoordinates',
  'relationship',
  'fieldGroup',
])

export const baseFieldMetadata = z.object({
  unique: optionalBoolean,
  required: optionalBoolean,
  graphIndex: optionalBoolean,
  searchIndex: optionalBoolean,
})

export const baseField = z
  .object({
    _id: nonEmptyString,
    _fieldId: nonEmptyString,
    _parentId: nonEmptyString.nullable(),
    _type: fieldType,
    name: nonEmptyString,
    description: emptyDefaultString,
    metadata: baseFieldMetadata,
  })
  .merge(withTimestamps)

export type FieldType = z.infer<typeof fieldType>
export type BaseField = z.infer<typeof baseField>
export type BaseFieldMetadata = z.infer<typeof baseFieldMetadata>
