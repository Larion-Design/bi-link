import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PersonModel, PersonSchema } from '@app/models'
import { PersonSnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class PersonHistorySnapshopModel implements PersonSnapshot {
  _id: string
  dateCreated: Date

  @Prop()
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: PersonSchema })
  entityInfo: PersonModel
}

export type PersonHistorySnapshotDocument = Document & PersonHistorySnapshopModel
export const PersonHistorySnapshopSchema = SchemaFactory.createForClass(PersonHistorySnapshopModel)
