import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { UpdateSource } from 'defs'

@Schema({ _id: false, timestamps: false })
export class UpdateSourceModel implements UpdateSource {
  @Prop({ type: SchemaTypes.String })
  type: 'USER' | 'SERVICE'

  @Prop()
  sourceId: string
}

export const UpdateSourceSchema = SchemaFactory.createForClass(UpdateSourceModel)
