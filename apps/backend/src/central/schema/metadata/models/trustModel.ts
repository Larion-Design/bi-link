import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Trustworthiness } from 'defs'

@Schema({ _id: false, timestamps: false })
export class TrustModel implements Trustworthiness {
  @Prop({ default: '' })
  source: string

  @Prop({ default: 0 })
  level: number
}

export const TrustSchema = SchemaFactory.createForClass(TrustModel)
