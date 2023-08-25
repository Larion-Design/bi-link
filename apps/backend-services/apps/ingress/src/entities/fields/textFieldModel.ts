import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { FieldType, TextField } from 'defs'
import { BaseFieldMetadataModel } from './baseFieldMetadataModel'

@Schema()
export class TextFieldModel implements TextField {
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ type: SchemaTypes.String, required: true })
  _type: Extract<FieldType, 'text'>

  @Prop({ required: true })
  value: string

  @Prop({ required: true })
  _fieldId: string

  @Prop({ required: true, default: null })
  _groupId: string | null

  metadata: BaseFieldMetadataModel
}
