import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Entity } from 'defs'

@Schema()
export class EntityModel implements Entity {
  _id?: string

  data: []

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  type: string
}

export const EntitySchema = SchemaFactory.createForClass(EntityModel)
