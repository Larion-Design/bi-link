import { Prop, Schema } from '@nestjs/mongoose'
import { FieldType, TextField } from 'defs'
import { BaseFieldModel } from './baseFieldModel'

@Schema()
export class TextFieldModel extends BaseFieldModel implements TextField {
  @Prop()
  declare _type: Extract<FieldType, 'text'>

  @Prop({ required: true })
  value: string
}
