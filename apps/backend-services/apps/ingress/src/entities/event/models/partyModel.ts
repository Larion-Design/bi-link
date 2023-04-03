import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { EventParticipant } from 'defs'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '../../customField/models/customFieldModel'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { PropertyDocument, PropertyModel } from '../../property/models/propertyModel'

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
