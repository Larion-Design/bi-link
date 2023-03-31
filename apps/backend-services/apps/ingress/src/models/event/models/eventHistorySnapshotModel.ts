import { UpdateSourceModel, UpdateSourceSchema } from 'src/shared/models/updateSourceModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { EventSnapshot } from 'defs'
import { Document } from 'mongoose'
import { EventModel, EventSchema } from './eventModel'

@Schema({ _id: true, timestamps: true })
export class EventHistorySnapshotModel implements EventSnapshot {
  _id: string

  @Prop({ index: true })
  entityId: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop({ type: EventSchema })
  entityInfo: EventModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type EventHistorySnapshotDocument = Document & EventHistorySnapshotModel
export const EventHistorySnapshotSchema = SchemaFactory.createForClass(EventHistorySnapshotModel)
