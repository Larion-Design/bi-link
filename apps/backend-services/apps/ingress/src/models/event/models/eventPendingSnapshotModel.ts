import { UpdateSourceModel, UpdateSourceSchema } from 'src/shared/models/updateSourceModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { EventSnapshot } from 'defs'
import { Document } from 'mongoose'
import { EventModel, EventSchema } from './eventModel'

@Schema({ _id: true, timestamps: true })
export class EventPendingSnapshotModel implements EventSnapshot {
  _id: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop({ index: true })
  entityId: string

  @Prop({ type: EventSchema })
  entityInfo: EventModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type EventPendingSnapshotDocument = Document & EventPendingSnapshotModel
export const EventPendingSnapshotSchema = SchemaFactory.createForClass(EventPendingSnapshotModel)
