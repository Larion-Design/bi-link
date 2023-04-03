import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Event } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../../customField/models/customFieldModel'
import { FileModel } from '../../file/models/fileModel'
import { LocationDocument, LocationModel } from '../../location/models/locationModel'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from '../../metadata/models/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '../../metadata/models/textValueWithMetadataModel'
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
