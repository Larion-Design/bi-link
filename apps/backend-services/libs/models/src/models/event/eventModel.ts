import { LocationDocument, LocationModel } from '@app/models/models/locationModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, SchemaTypes } from 'mongoose'
import { Event } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../customFieldModel'
import { FileModel } from '../fileModel'
import { PartyModel, PartySchema } from './partyModel'

@Schema({ timestamps: true })
export class EventModel implements Event {
  _id: string

  @Prop({ isRequired: false, default: '' })
  description: string

  @Prop()
  type: string

  @Prop({ type: SchemaTypes.Date })
  date: Date

  @Prop({ type: Types.ObjectId, ref: LocationModel.name, isRequired: false, default: null })
  location: LocationDocument | null

  @Prop({ type: [PartySchema], isRequired: false })
  parties: PartyModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type EventDocument = EventModel & Document<string>
export const EventSchema = SchemaFactory.createForClass(EventModel)
