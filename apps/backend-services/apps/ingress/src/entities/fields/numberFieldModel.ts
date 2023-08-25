import { Schema, Prop } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { FieldType, NumberField } from 'defs'
import { BaseFieldMetadataModel } from './baseFieldMetadataModel'

@Schema()
export class NumberFieldModel implements NumberField {
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ type: SchemaTypes.String })
  _type: Extract<FieldType, 'number'>

  @Prop({ required: true })
  value: number

  @Prop({ required: true })
  _fieldId: string

  @Prop({ required: true, default: null })
  _groupId: string | null

  @Prop({ required: true, default: null })
  metadata: BaseFieldMetadataModel
}
