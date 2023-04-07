import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { OptionalDateWithMetadata } from 'defs'
import { MetadataModel, MetadataSchema } from './metadataModel'

@Schema({ _id: false, timestamps: false })
export class OptionalDateValueWithMetadataModel implements OptionalDateWithMetadata {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: SchemaTypes.Date, default: null })
  value?: Date | string | null
}

export const OptionalDateValueWithMetadataSchema = SchemaFactory.createForClass(
  OptionalDateValueWithMetadataModel,
)
