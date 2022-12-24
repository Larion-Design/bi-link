import { Text } from 'defs'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: false, _id: false })
export class TextModel implements Text {
  @Prop()
  content: string
}

export const TextSchema = SchemaFactory.createForClass(TextModel)
