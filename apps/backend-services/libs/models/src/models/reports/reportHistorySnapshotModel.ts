import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ReportModel, ReportSchema } from './reportModel'
import { ReportSnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class ReportHistorySnapshotModel implements ReportSnapshot {
  _id: string

  @Prop({ index: true })
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: ReportSchema })
  entityInfo: ReportModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type ReportHistorySnapshotDocument = Document & ReportHistorySnapshotModel
export const ReportHistorySnapshotSchema = SchemaFactory.createForClass(ReportHistorySnapshotModel)
