import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { EventSnapshot } from 'defs'
import { Document } from 'mongoose'
import { EventModel, EventSchema } from './eventModel'

@Schema({ _id: true, timestamps: true })
export class EventPendingSnapshotModel implements EventSnapshot {
  _id: string
  dateCreated: Date

  @Prop({ index: true })
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: EventSchema })
  entityInfo: EventModel
}

export type EventPendingSnapshotDocument = Document & EventPendingSnapshotModel
export const EventPendingSnapshotSchema = SchemaFactory.createForClass(EventPendingSnapshotModel)
