import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
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

  @Prop({ type: Types.ObjectId, ref: 'PersonModel', index: true, sparse: true })
  person: PersonDocument

  @Prop({ type: [{ type: Types.ObjectId, ref: 'PersonModel' }], index: true, sparse: true })
  relatedPersons: PersonDocument[]
}

export type RelationshipDocument = RelationshipModel & Document
export const RelationshipSchema = SchemaFactory.createForClass(RelationshipModel)
