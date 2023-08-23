import { Schema, Prop } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { BaseField, FieldType } from 'defs'
import { BaseFieldMetadataModel } from './baseFieldMetadataModel'

@Schema({ discriminatorKey: '_type' })
export class BaseFieldModel implements BaseField {
  _id: string

  @Prop({ index: true })
  _fieldId: string

  @Prop({ index: true, sparse: true })
  _groupId: string | null | undefined

  @Prop({ type: SchemaTypes.String, index: true })
  _type: FieldType

  @Prop()
  name: string

  @Prop()
  metadata: BaseFieldMetadataModel
}
