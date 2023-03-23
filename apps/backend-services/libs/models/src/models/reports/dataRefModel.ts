import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { CompanyDocument, CompanyModel } from '@app/models/models/company/companyModel'
import { EventDocument, EventModel } from '@app/models/models/event/eventModel'
import { PersonDocument, PersonModel } from '@app/models/models/person/personModel'
import { PropertyDocument, PropertyModel } from '@app/models/models/property/propertyModel'
import { DataRef } from 'defs'

@Schema({ timestamps: false })
export class DataRefModel implements DataRef {
  @Prop()
  _id: string

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: CompanyModel.name, isRequired: false })
  company?: CompanyDocument

  @Prop({ type: Types.ObjectId, ref: PropertyModel.name, isRequired: false })
  property?: PropertyDocument

  @Prop({ type: Types.ObjectId, ref: EventModel.name, isRequired: false })
  event?: EventDocument

  @Prop()
  field: string

  @Prop({ isRequired: false })
  path?: string

  @Prop({ isRequired: false })
  targetId: string
}

export type DataRefDocument = DataRefModel & Document
export const DataRefSchema = SchemaFactory.createForClass(DataRefModel)
