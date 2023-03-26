import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CompanySnapshot } from 'defs'
import { Document } from 'mongoose'
import { CompanyModel, CompanySchema } from '@app/models'

@Schema({ _id: true, timestamps: true })
export class CompanyPendingSnapshotModel implements CompanySnapshot {
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

export type CompanyPendingSnapshotDocument = Document & CompanyPendingSnapshotModel
export const CompanyPendingSnapshotSchema = SchemaFactory.createForClass(
  CompanyPendingSnapshotModel,
)
