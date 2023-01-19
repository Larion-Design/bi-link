import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { EntityInfoField } from 'defs'

@Schema({ _id: false, timestamps: false })
export class EntityInfoFieldModel implements EntityInfoField {
  @Prop()
  field: string

  @Prop({ isRequired: false })
  path?: string
}

export const EntityInfoFieldSchema = SchemaFactory.createForClass(EntityInfoFieldModel)
