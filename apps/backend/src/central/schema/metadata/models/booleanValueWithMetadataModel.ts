import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BooleanWithMetadata } from 'defs'
import { MetadataModel, MetadataSchema } from './metadataModel'

@Schema({ _id: false, timestamps: false })
export class BooleanValueWithMetadataModel implements BooleanWithMetadata {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  value: boolean
}

export const BooleanValueWithMetadataSchema = SchemaFactory.createForClass(
  BooleanValueWithMetadataModel,
)
