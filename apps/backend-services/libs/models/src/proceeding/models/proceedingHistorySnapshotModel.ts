import { ProceedingModel, ProceedingSchema } from '@app/models/proceeding/models/proceedingModel'
import { UpdateSourceModel, UpdateSourceSchema } from '@app/models/shared/models/updateSourceModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ProceedingSnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class ProceedingHistorySnapshotModel implements ProceedingSnapshot {
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

export type ProceedingHistorySnapshotDocument = Document & ProceedingHistorySnapshotModel
export const ProceedingHistorySnapshotSchema = SchemaFactory.createForClass(
  ProceedingHistorySnapshotModel,
)
