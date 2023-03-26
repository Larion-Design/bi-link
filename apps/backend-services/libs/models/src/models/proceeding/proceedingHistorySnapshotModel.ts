import { ProceedingModel, ProceedingSchema } from '@app/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ProceedingSnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class ProceedingHistorySnapshotModel implements ProceedingSnapshot {
  _id: string
  dateCreated: Date

  @Prop({ index: true })
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: ProceedingSchema })
  entityInfo: ProceedingModel
}

export type ProceedingHistorySnapshotDocument = Document & ProceedingHistorySnapshotModel
export const ProceedingHistorySnapshotSchema = SchemaFactory.createForClass(
  ProceedingHistorySnapshotModel,
)
