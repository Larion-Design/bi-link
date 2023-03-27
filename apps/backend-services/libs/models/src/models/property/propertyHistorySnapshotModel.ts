import { PropertyModel, PropertySchema } from '@app/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { PropertySnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class PropertyHistorySnapshotModel implements PropertySnapshot {
  _id: string

  @Prop({ index: true })
  entityId: string

  @Prop({ isRequired: false })
  serviceId?: string

  @Prop({ isRequired: false })
  userId?: string

  @Prop({ type: PropertySchema })
  entityInfo: PropertyModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type PropertyHistorySnapshotDocument = Document & PropertyHistorySnapshotModel
export const PropertyHistorySnapshotSchema = SchemaFactory.createForClass(
  PropertyHistorySnapshotModel,
)
