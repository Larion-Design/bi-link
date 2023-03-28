import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { PropertySnapshot } from 'defs'
import { UpdateSourceModel, UpdateSourceSchema } from '@app/models/shared/models/updateSourceModel'
import { PropertyModel, PropertySchema } from '@app/models/property/models/propertyModel'

@Schema({ _id: true, timestamps: true })
export class PropertyHistorySnapshotModel implements PropertySnapshot {
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

export type PropertyHistorySnapshotDocument = Document & PropertyHistorySnapshotModel
export const PropertyHistorySnapshotSchema = SchemaFactory.createForClass(
  PropertyHistorySnapshotModel,
)
