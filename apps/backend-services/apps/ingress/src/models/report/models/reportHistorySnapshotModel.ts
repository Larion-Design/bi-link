import { UpdateSourceModel, UpdateSourceSchema } from 'src/shared/models/updateSourceModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ReportModel, ReportSchema } from './reportModel'
import { ReportSnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class ReportHistorySnapshotModel implements ReportSnapshot {
  _id: string

  @Prop({ index: true })
  entityId: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop({ type: ReportSchema })
  entityInfo: ReportModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type ReportHistorySnapshotDocument = Document & ReportHistorySnapshotModel
export const ReportHistorySnapshotSchema = SchemaFactory.createForClass(ReportHistorySnapshotModel)
