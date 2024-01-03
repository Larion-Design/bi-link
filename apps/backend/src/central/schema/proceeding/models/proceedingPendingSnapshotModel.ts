import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ProceedingSnapshot } from 'defs'
import { UpdateSourceModel, UpdateSourceSchema } from '../../shared/models/updateSourceModel'
import { ProceedingModel, ProceedingSchema } from './proceedingModel'

@Schema({ _id: true, timestamps: true })
export class ProceedingPendingSnapshotModel implements ProceedingSnapshot {
  _id: string

  @Prop({ index: true })
  entityId: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop({ type: ProceedingSchema })
  entityInfo: ProceedingModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type ProceedingPendingSnapshotDocument = Document & ProceedingPendingSnapshotModel
export const ProceedingPendingSnapshotSchema = SchemaFactory.createForClass(
  ProceedingPendingSnapshotModel,
)
