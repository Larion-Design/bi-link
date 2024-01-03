import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { NumberWithMetadata } from 'defs'
import { MetadataModel, MetadataSchema } from './metadataModel'

@Schema({ _id: false, timestamps: false })
export class NumberValueWithMetadataModel implements NumberWithMetadata {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  value: number
}

export const NumberValueWithMetadataSchema = SchemaFactory.createForClass(
  NumberValueWithMetadataModel,
)
