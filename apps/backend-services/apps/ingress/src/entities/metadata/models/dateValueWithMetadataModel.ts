import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { DateWithMetadata } from 'defs'
import { MetadataModel, MetadataSchema } from './metadataModel'

@Schema({ _id: false, timestamps: false })
export class DateValueWithMetadataModel implements DateWithMetadata {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: SchemaTypes.Date })
  value: Date
}

export const DateValueWithMetadataSchema = SchemaFactory.createForClass(DateValueWithMetadataModel)
