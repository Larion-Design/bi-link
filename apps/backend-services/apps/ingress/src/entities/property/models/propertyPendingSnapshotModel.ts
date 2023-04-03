import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { UpdateSourceModel, UpdateSourceSchema } from '../../shared/models/updateSourceModel'
import { PropertyModel, PropertySchema } from './propertyModel'
import { PropertySnapshot } from 'defs'

@Schema({ _id: true, timestamps: true })
export class PropertyPendingSnapshotModel implements PropertySnapshot {
  _id: string

  @Prop({ index: true })
  entityId: string

  @Prop({ type: UpdateSourceSchema })
  source: UpdateSourceModel

  @Prop({ type: PropertySchema })
  entityInfo: PropertyModel

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type PropertyPendingSnapshotDocument = Document & PropertyPendingSnapshotModel
export const PropertyPendingSnapshotSchema = SchemaFactory.createForClass(
  PropertyPendingSnapshotModel,
)
