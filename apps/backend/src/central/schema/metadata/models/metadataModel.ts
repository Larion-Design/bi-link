import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Metadata } from 'defs'
import { TrustModel, TrustSchema } from './trustModel'

@Schema({ _id: false, timestamps: true })
export class MetadataModel implements Metadata {
  @Prop()
  access: string

  @Prop()
  confirmed: boolean

  @Prop({ type: TrustSchema })
  trustworthiness: TrustModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const MetadataSchema = SchemaFactory.createForClass(MetadataModel)
