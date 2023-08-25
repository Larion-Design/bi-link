import { Schema, Prop } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { BaseField, FieldType } from 'defs'
import { BaseFieldMetadataModel } from './baseFieldMetadataModel'

@Schema({ discriminatorKey: '_type' })
export class BaseFieldModel implements BaseField {
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ index: true })
  _fieldId: string

  @Prop({ index: true, sparse: true, default: null })
  _groupId: string | null

  @Prop({
    type: SchemaTypes.String,
    required: true,
    index: true,
    enum: [
      'number',
      'text',
      'date',
      'geoCoordinates',
      'entityId',
      'relationship',
      'relationshipGroup',
      'dateRange',
      'numberRange',
    ] as FieldType[],
  })
  _type: FieldType

  @Prop()
  metadata: BaseFieldMetadataModel
}
