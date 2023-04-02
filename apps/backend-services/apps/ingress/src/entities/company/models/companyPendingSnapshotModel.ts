import { UpdateSourceModel, UpdateSourceSchema } from 'src/shared/models/updateSourceModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CompanySnapshot } from 'defs'
import { Document } from 'mongoose'
import { CompanyModel, CompanySchema } from './companyModel'

@Schema({ _id: true, timestamps: true })
export class CompanyPendingSnapshotModel implements CompanySnapshot {
  _id: string

  @Prop({ index: true })
  entityId: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop({ type: CompanySchema })
  entityInfo: CompanyModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type CompanyPendingSnapshotDocument = Document & CompanyPendingSnapshotModel
export const CompanyPendingSnapshotSchema = SchemaFactory.createForClass(
  CompanyPendingSnapshotModel,
)
