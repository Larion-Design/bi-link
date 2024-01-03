import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CustomField } from 'defs'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'

@Schema({ timestamps: false })
export class CustomFieldModel implements CustomField {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ required: true })
  fieldName: string

  @Prop({ required: true })
  fieldValue: string
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomFieldModel)
