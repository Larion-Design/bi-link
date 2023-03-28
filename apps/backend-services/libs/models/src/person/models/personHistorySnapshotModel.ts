import { UpdateSourceModel, UpdateSourceSchema } from '@app/models/shared/models/updateSourceModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PersonSnapshot } from 'defs'
import { PersonModel, PersonSchema } from '@app/models/person/models/personModel'

@Schema({ _id: true, timestamps: true })
export class PersonHistorySnapshotModel implements PersonSnapshot {
  _id: string

  @Prop()
  entityId: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop({ type: PersonSchema })
  entityInfo: PersonModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type PersonHistorySnapshotDocument = Document & PersonHistorySnapshotModel
export const PersonHistorySnapshotSchema = SchemaFactory.createForClass(PersonHistorySnapshotModel)
