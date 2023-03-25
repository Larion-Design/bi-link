import { MetadataModel, MetadataSchema } from '@app/models/models'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from '@app/models/models/generic/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '@app/models/models/generic/textValueWithMetadataModel'
import { LocationDocument, LocationModel } from '@app/models/models/locationModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Event } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../customFieldModel'
import { FileModel } from '../fileModel'
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
}

export type EventDocument = EventModel & Document<string>
export const EventSchema = SchemaFactory.createForClass(EventModel)
