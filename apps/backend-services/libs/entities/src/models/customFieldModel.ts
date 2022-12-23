import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { CustomField } from '@app/definitions/customField'

@Schema()
export class CustomFieldModel implements CustomField {
  @Prop({ required: true })
  fieldName: string

  @Prop({ required: true })
  fieldValue: string
}

export type CustomFieldDocument = CustomFieldModel & Document
export const CustomFieldSchema = SchemaFactory.createForClass(CustomFieldModel)
