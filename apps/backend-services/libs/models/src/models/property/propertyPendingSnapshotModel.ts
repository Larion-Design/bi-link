import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { PropertyModel, PropertySchema } from './propertyModel'
import { PropertySnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class PropertyPendingSnapshotModel implements PropertySnapshot {
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

export type PropertyPendingSnapshotDocument = Document & PropertyPendingSnapshotModel
export const PropertyPendingSnapshotSchema = SchemaFactory.createForClass(
  PropertyPendingSnapshotModel,
)
