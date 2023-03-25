import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MetadataModel, MetadataSchema } from '@app/models/models/metadata/metadataModel'
import { CustomField } from 'defs'

@Schema()
export class CustomFieldModel implements CustomField {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ required: true })
  fieldName: string

  @Prop({ required: true })
  fieldValue: string
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomFieldModel)
