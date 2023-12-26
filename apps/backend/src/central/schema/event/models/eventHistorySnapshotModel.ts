import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventSnapshot } from 'defs';
import { Document } from 'mongoose';
import {
  UpdateSourceModel,
  UpdateSourceSchema,
} from '../../shared/models/updateSourceModel';
import { EventModel, EventSchema } from './eventModel';

@Schema({ _id: true, timestamps: true })
export class EventHistorySnapshotModel implements EventSnapshot {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ index: true })
  entityId: string;

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel;

  @Prop({ type: EventSchema })
  entityInfo: EventModel;
}

export type EventHistorySnapshotDocument = Document & EventHistorySnapshotModel;
export const EventHistorySnapshotSchema = SchemaFactory.createForClass(
  EventHistorySnapshotModel,
);
