import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ReportModel, ReportSchema } from './reportModel'
import { ReportSnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class ReportPendingSnapshotModel implements ReportSnapshot {
  _id: string
  dateCreated: Date

  @Prop({ index: true })
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: ReportSchema })
  entityInfo: ReportModel
}

export type ReportPendingSnapshotDocument = Document & ReportPendingSnapshotModel
export const ReportPendingSnapshotSchema = SchemaFactory.createForClass(ReportPendingSnapshotModel)
