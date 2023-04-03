import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PersonSnapshot } from 'defs'
import { UpdateSourceModel, UpdateSourceSchema } from '../../shared/models/updateSourceModel'
import { PersonModel, PersonSchema } from './personModel'

@Schema({ _id: true, timestamps: true })
export class PersonPendingSnapshotModel implements PersonSnapshot {
  _id: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop()
  entityId: string

  @Prop({ type: PersonSchema })
  entityInfo: PersonModel

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type PersonPendingSnapshotDocument = Document & PersonPendingSnapshotModel
export const PersonPendingSnapshotSchema = SchemaFactory.createForClass(PersonPendingSnapshotModel)
