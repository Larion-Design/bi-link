import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { RelationshipInfoField } from 'defs'

@Schema({ _id: false, timestamps: false })
export class RelationshipInfoFieldModel implements RelationshipInfoField {
  @Prop()
  field: string

  @Prop()
  path: string

  @Prop()
  targetId: string
}

export const RelationshipInfoFieldSchema = SchemaFactory.createForClass(RelationshipInfoFieldModel)
