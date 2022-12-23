import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { CustomFieldModel, CustomFieldSchema } from './customFieldModel'
import { FileModel } from './fileModel'
import { PartyModel, PartySchema } from './partyModel'
import { Incident } from '@app/definitions/incident'

@Schema({ timestamps: true })
export class IncidentModel implements Incident {
  @Prop({ isRequired: false, default: '' })
  description: string

  @Prop()
  type: string

  @Prop()
  date: Date

  @Prop()
  location: string

  @Prop({ type: [PartySchema], isRequired: false })
  parties: PartyModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type IncidentDocument = IncidentModel & Document
export const IncidentSchema = SchemaFactory.createForClass(IncidentModel)
