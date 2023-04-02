import { UpdateSourceModel, UpdateSourceSchema } from 'src/shared/models/updateSourceModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { CompanySnapshot } from 'defs'
import { CompanyModel, CompanySchema } from 'src/index'

@Schema({ _id: true, timestamps: true })
export class CompanyHistorySnapshotModel implements CompanySnapshot {
  _id: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop({ index: true })
  entityId: string

  @Prop({ type: CompanySchema })
  entityInfo: CompanyModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type CompanyHistorySnapshotDocument = Document & CompanyHistorySnapshotModel
export const CompanyHistorySnapshotSchema = SchemaFactory.createForClass(
  CompanyHistorySnapshotModel,
)
