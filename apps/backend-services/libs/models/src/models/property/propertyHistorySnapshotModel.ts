import { PropertyModel, PropertySchema } from '@app/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { PropertySnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class PropertyHistorySnapshotModel implements PropertySnapshot {
  _id: string
  dateCreated: Date

  @Prop({ index: true })
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: PropertySchema })
  entityInfo: PropertyModel
}

export type PropertyHistorySnapshotDocument = Document & PropertyHistorySnapshotModel
export const PropertyHistorySnapshotSchema = SchemaFactory.createForClass(
  PropertyHistorySnapshotModel,
)
