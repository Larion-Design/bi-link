import { MetadataModel, MetadataSchema } from '@app/models/models/metadata/metadataModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { PersonDocument } from './personModel'
import { Relationship } from 'defs'

@Schema({ _id: false, timestamps: false })
export class RelationshipModel implements Relationship {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  type: string

  @Prop()
  proximity: number

  @Prop()
  description: string

  @Prop({ type: Types.ObjectId, ref: 'PersonModel' })
  person: PersonDocument

  @Prop({ type: [{ type: Types.ObjectId, ref: 'PersonModel' }] })
  relatedPersons: PersonDocument[]
}

export type RelationshipDocument = RelationshipModel & Document
export const RelationshipSchema = SchemaFactory.createForClass(RelationshipModel)
