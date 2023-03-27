import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PersonSnapshot } from 'defs'
import { PersonModel, PersonSchema } from '@app/models/models/person/personModel'

@Schema({ _id: true, timestamps: true })
export class PersonHistorySnapshopModel implements PersonSnapshot {
  _id: string

  @Prop()
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: PersonSchema })
  entityInfo: PersonModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type PersonHistorySnapshotDocument = Document & PersonHistorySnapshopModel
export const PersonHistorySnapshopSchema = SchemaFactory.createForClass(PersonHistorySnapshopModel)
