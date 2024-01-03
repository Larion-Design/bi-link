import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { TextWithMetadata } from 'defs'
import { MetadataModel, MetadataSchema } from './metadataModel'

@Schema({ _id: false, timestamps: false })
export class TextValueWithMetadataModel implements TextWithMetadata {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  value: string
}

export const TextValueWithMetadataSchema = SchemaFactory.createForClass(TextValueWithMetadataModel)
