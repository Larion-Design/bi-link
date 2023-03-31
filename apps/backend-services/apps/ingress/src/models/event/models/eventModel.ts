import { MetadataModel, MetadataSchema } from 'src/metadata/models/metadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from 'src/metadata/models/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from 'src/metadata/models/textValueWithMetadataModel'
import { LocationDocument, LocationModel } from 'src/location/models/locationModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Event } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../../shared/models/customFieldModel'
import { FileModel } from '../../file/models/fileModel'
import { PartyModel, PartySchema } from './partyModel'

@Schema({ timestamps: true })
export class EventModel implements Event {
  _id: string

  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  type: TextValueWithMetadataModel

  @Prop()
  description: string

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  date: OptionalDateValueWithMetadataModel

  @Prop({ type: Types.ObjectId, ref: LocationModel.name, isRequired: false, default: null })
  location: LocationDocument | null

  @Prop({ type: [PartySchema] })
  parties: PartyModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema] })
  customFields: CustomFieldModel[]

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type EventDocument = EventModel & Document<string>
export const EventSchema = SchemaFactory.createForClass(EventModel)
