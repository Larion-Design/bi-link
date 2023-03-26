import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { CompanySnapshot } from 'defs'
import { CompanyModel, CompanySchema } from '@app/models'

@Schema({ _id: true, timestamps: true })
export class CompanyHistorySnapshotModel implements CompanySnapshot {
  _id: string
  dateCreated: Date

  @Prop({ index: true })
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: CompanySchema })
  entityInfo: CompanyModel
}

export type CompanyHistorySnapshotDocument = Document & CompanyHistorySnapshotModel
export const CompanyHistorySnapshotSchema = SchemaFactory.createForClass(
  CompanyHistorySnapshotModel,
)
