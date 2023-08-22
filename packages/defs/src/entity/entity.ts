import { z } from 'zod'
import { withTimestamps } from '../modelTimestamps'

const fieldMetadata = z.object({
  unique: z.boolean().default(false).nullish(),
  db: z.object({
    index: z.boolean().default(false),
  }),
  search: z.object({
    index: z.boolean().default(false),
  }),
  graph: z.object({
    index: z.boolean().default(false),
  }),
})

const baseField = z
  .object({
    _id: z.string().nonempty(),
    name: z.string(),
    metadata: fieldMetadata,
  })
  .merge(withTimestamps)

const entityIdField = z
  .object({
    _type: z.literal('entityId'),
    value: z.string().nonempty().nullable(),
  })
  .merge(baseField)

const numberField = z
  .object({
    _type: z.literal('number'),
    value: z.number(),
  })
  .merge(baseField)

const textField = z
  .object({
    _type: z.literal('text'),
    value: z.string(),
  })
  .merge(baseField)

const dateField = z
  .object({
    _type: z.literal('date'),
    value: z.date(),
  })
  .merge(baseField)

const geoCoordinatesField = z
  .object({
    _type: z.literal('geoCoordinates'),
    value: z.tuple([z.number(), z.number()]),
  })
  .merge(baseField)

const fieldsList = z
  .union([entityIdField, numberField, textField, dateField, geoCoordinatesField])
  .array()

const relationshipField = z
  .object({
    _type: z.literal('relationship'),
    entityId: z.string().nonempty().nullable(),
    data: fieldsList,
  })
  .merge(baseField)

const nestedField = z
  .object({
    _type: z.literal('nestedField'),
    value: fieldsList,
  })
  .merge(baseField)

export const entitySchema = z
  .object({
    _id: z.string().nonempty().nullish(),
    name: z.string(),
    data: z
      .union([
        entityIdField,
        numberField,
        textField,
        dateField,
        geoCoordinatesField,
        relationshipField,
        nestedField,
      ])
      .array(),
  })
  .merge(withTimestamps)

export type EntityIdField = z.infer<typeof entityIdField>
export type NumberField = z.infer<typeof numberField>
export type TextField = z.infer<typeof textField>
export type DateField = z.infer<typeof dateField>
export type NestedField = z.infer<typeof nestedField>
export type RelationshipField = z.infer<typeof relationshipField>

export type Entity = z.infer<typeof entitySchema>
