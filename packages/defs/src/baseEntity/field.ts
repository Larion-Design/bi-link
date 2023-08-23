import { z } from 'zod'
import { withTimestamps } from '../modelTimestamps'

const fieldTypes = z.enum([
  'entityId',
  'dateRange',
  'numberRange',
  'number',
  'text',
  'date',
  'geoCoordinates',
  'relationship',
  'relationshipGroup',
  'map',
  'set',
])

const baseFieldMetadata = z.object({
  unique: z.boolean().default(false).nullish(),
  required: z.boolean().default(false).nullish(),
  dbIndex: z.boolean().default(false).nullish(),
  graphIndex: z.boolean().default(false).nullish(),
  searchIndex: z.boolean().default(false).nullish(),
})

const baseField = z
  .object({
    _id: z.string().nonempty(),
    _groupId: z.string().nonempty().nullish(),
    _fieldId: z.string().nonempty(),
    _type: fieldTypes,
    name: z.string(),
    metadata: baseFieldMetadata,
  })
  .merge(withTimestamps)

export const entityIdField = baseField.merge(
  z.object({
    _type: z.literal(fieldTypes.enum.entityId),
    entityId: z.string().nonempty().nullable(),
  }),
)

export const numberField = z
  .object({
    _type: z.literal(fieldTypes.enum.number),
    value: z.number(),
  })
  .merge(baseField)

export const textField = z
  .object({
    _type: z.literal(fieldTypes.enum.text),
    value: z.string(),
  })
  .merge(baseField)

export const dateField = z
  .object({
    _type: z.literal(fieldTypes.enum.date),
    value: z.date().nullable(),
  })
  .merge(baseField)

export const geoCoordinatesField = z
  .object({
    _type: z.literal(fieldTypes.enum.geoCoordinates),
    value: z.tuple([z.number().default(0), z.number().default(0)]),
  })
  .merge(baseField)

export const dateRangeField = baseField.merge(
  z.object({
    _type: z.literal(fieldTypes.enum.dateRange),
    value: z.tuple([z.date().nullable(), z.date().nullable()]),
  }),
)

export const numberRangeField = baseField.merge(
  z.object({
    _type: z.literal(fieldTypes.enum.numberRange),
    value: z.tuple([z.number().nullable(), z.number().nullable()]),
  }),
)

const fieldsList = z
  .union([entityIdField, numberField, textField, dateField, geoCoordinatesField])
  .array()

export const relationshipField = z
  .object({
    _type: z.literal(fieldTypes.enum.relationship),
    entityId: z.string().nonempty().nullable(),
    bidirectional: z.boolean().default(false).nullish(),
    data: fieldsList,
  })
  .merge(baseField)

export const relationshipGroupField = z
  .object({
    _type: z.literal(fieldTypes.enum.relationshipGroup),
    entitesIds: z.string().nonempty().array(),
    data: fieldsList,
  })
  .merge(baseField)

export const mapField = baseField.merge(
  z.object({
    _type: z.literal(fieldTypes.enum.map),
    data: z.record(z.string().nonempty(), z.string()),
  }),
)

export const setField = baseField.merge(
  z.object({
    _type: z.literal(fieldTypes.enum.map),
    data: z.string().nonempty().array(),
  }),
)

export type EntityIdField = z.infer<typeof entityIdField>
export type NumberField = z.infer<typeof numberField>
export type TextField = z.infer<typeof textField>
export type DateField = z.infer<typeof dateField>
export type RelationshipField = z.infer<typeof relationshipField>
export type RelationshipGroupField = z.infer<typeof relationshipGroupField>
export type DateRangeField = z.infer<typeof dateRangeField>
export type NumberRangeField = z.infer<typeof dateRangeField>
export type MapField = z.infer<typeof mapField>
export type SetField = z.infer<typeof setField>
export type BaseField = z.infer<typeof baseField>
export type BaseFieldMetadata = z.infer<typeof baseFieldMetadata>
