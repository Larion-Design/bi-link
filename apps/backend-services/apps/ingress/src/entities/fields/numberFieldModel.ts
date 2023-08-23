import { Schema, Prop } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { FieldType, NumberField } from 'defs'
import { BaseFieldModel } from './baseFieldModel'

@Schema()
export class NumberFieldModel extends BaseFieldModel implements NumberField {
  @Prop({ type: SchemaTypes.String })
  declare _type: 'map'

  @Prop({ required: true })
  value: number
}
