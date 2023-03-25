import { MetadataModel, MetadataSchema } from '@app/models/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { EventParticipant } from 'defs'
import { PersonDocument, PersonModel } from '@app/models/models/person/personModel'
import { CompanyDocument, CompanyModel } from '@app/models/models/company/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '../customFieldModel'
import { PropertyDocument, PropertyModel } from '@app/models/models/property/propertyModel'

@Schema({ _id: false, timestamps: false })
export class PartyModel implements EventParticipant {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  type: string

  @Prop()
  description: string

  @Prop({ type: [{ type: Types.ObjectId, ref: PersonModel.name }] })
  persons: PersonDocument[]

  @Prop({ type: [{ type: Types.ObjectId, ref: CompanyModel.name }] })
  companies: CompanyDocument[]

  @Prop({ type: [{ type: Types.ObjectId, ref: PropertyModel.name }] })
  properties: PropertyDocument[]

  @Prop({ type: [CustomFieldSchema] })
  customFields: CustomFieldModel[]
}

export type PartyDocument = PartyModel & Document
export const PartySchema = SchemaFactory.createForClass(PartyModel)
