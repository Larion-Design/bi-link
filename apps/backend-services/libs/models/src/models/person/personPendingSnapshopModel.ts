import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PersonModel } from '@app/models'
import { PersonSnapshot } from 'defs/dist/person/personSnapshot'

@Schema({ _id: true, timestamps: true })
export class PersonPendingSnapshotModel implements PersonSnapshot {
  _id: string
  dateCreated: Date

  @Prop()
  entityId: string

  @Prop({ type: PersonModel.name })
  entityInfo: PersonModel

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string
}

export type PersonPendingSnapshotDocument = Document & PersonPendingSnapshotModel
export const PersonPendingSnapshopSchema = SchemaFactory.createForClass(PersonPendingSnapshotModel)
