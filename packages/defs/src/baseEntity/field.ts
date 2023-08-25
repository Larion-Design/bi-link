import { z } from 'zod'
import { withTimestamps } from '../timestamps'

const fieldType = z.enum([
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
  graphIndex: z.boolean().default(false).nullish(),
  searchIndex: z.boolean().default(false).nullish(),
})

const baseField = z
  .object({
    _id: z.string().nonempty(),
    _groupId: z.string().nonempty().nullish(),
    _fieldId: z.string().nonempty(),
    _type: fieldType,
    name: z.string(),
    description: z.string(),
    metadata: baseFieldMetadata,
  })
  .merge(withTimestamps)

export const entityIdField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.entityId),
    entityId: z.string().nonempty().nullable(),
  }),
)

export const numberField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.number),
    value: z.number(),
  }),
)

export const textField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.text),
    value: z.string(),
  }),
)

export const dateField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.date),
    value: z.date().nullable(),
  }),
)

export const geoCoordinatesField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.geoCoordinates),
    value: z.tuple([z.number().default(0), z.number().default(0)]),
  }),
)

export const dateRangeField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.dateRange),
    value: z.tuple([z.date().nullable(), z.date().nullable()]),
  }),
)

export const numberRangeField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.numberRange),
    value: z.tuple([z.number().nullable(), z.number().nullable()]),
  }),
)

const fieldsList = z
  .union([entityIdField, numberField, textField, dateField, geoCoordinatesField])
  .array()

export const relationshipField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.relationship),
    entityId: z.string().nonempty().nullable(),
    bidirectional: z.boolean().default(false).nullish(),
    data: fieldsList,
  }),
)

export const relationshipGroupField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.relationshipGroup),
    entitesIds: z.string().nonempty().array(),
    data: fieldsList,
  }),
)

export const mapField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.map),
    data: z.record(z.string().nonempty(), z.string()),
  }),
)

export const setField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.map),
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
export type NumberRangeField = z.infer<typeof numberRangeField>
export type MapField = z.infer<typeof mapField>
export type SetField = z.infer<typeof setField>
export type BaseField = z.infer<typeof baseField>
export type BaseFieldMetadata = z.infer<typeof baseFieldMetadata>
export type FieldType = z.infer<typeof fieldType>
