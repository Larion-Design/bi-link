import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ProceedingSnapshot } from 'defs'
import { ProceedingModel, ProceedingSchema } from '@app/models'

@Schema({ _id: true, timestamps: true })
export class ProceedingPendingSnapshotModel implements ProceedingSnapshot {
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

export type ProceedingPendingSnapshotDocument = Document & ProceedingPendingSnapshotModel
export const ProceedingPendingSnapshotSchema = SchemaFactory.createForClass(
  ProceedingPendingSnapshotModel,
)
