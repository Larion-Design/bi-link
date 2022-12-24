import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CustomField } from 'defs'

@Schema()
export class CustomFieldModel implements CustomField {
  @Prop({ required: true })
  fieldName: string

  @Prop({ required: true })
  fieldValue: string
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomFieldModel)
