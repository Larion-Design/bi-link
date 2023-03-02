import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { PersonDocument } from './personModel'
import { Relationship } from 'defs'

@Schema({ _id: false })
export class RelationshipModel implements Relationship {
  @Prop({ isRequired: false, default: true })
  _confirmed: boolean

  @Prop()
  type: string

  @Prop()
  proximity: number

  @Prop({ type: Types.ObjectId, ref: 'PersonModel' })
  person: PersonDocument
}

export type RelationshipDocument = RelationshipModel & Document
export const RelationshipSchema = SchemaFactory.createForClass(RelationshipModel)
