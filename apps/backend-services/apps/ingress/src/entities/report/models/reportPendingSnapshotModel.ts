import { UpdateSourceModel, UpdateSourceSchema } from 'src/shared/models/updateSourceModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ReportModel, ReportSchema } from './reportModel'
import { ReportSnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class ReportPendingSnapshotModel implements ReportSnapshot {
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

export type ReportPendingSnapshotDocument = Document & ReportPendingSnapshotModel
export const ReportPendingSnapshotSchema = SchemaFactory.createForClass(ReportPendingSnapshotModel)
