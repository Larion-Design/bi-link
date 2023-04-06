import { Document, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DataRef } from 'defs'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { EventDocument, EventModel } from '../../event/models/eventModel'
import { LocationDocument, LocationModel } from '../../location/models/locationModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { ProceedingDocument, ProceedingModel } from '../../proceeding/models/proceedingModel'
import { PropertyDocument, PropertyModel } from '../../property/models/propertyModel'

@Schema({ _id: true, timestamps: false })
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

  @Prop({ type: Types.ObjectId, ref: ProceedingModel.name, isRequired: false })
  proceeding?: ProceedingDocument

  @Prop({ type: Types.ObjectId, ref: LocationModel.name, isRequired: false })
  location?: LocationDocument

  @Prop()
  field: string

  @Prop({ isRequired: false })
  path?: string | null | undefined

  @Prop({ isRequired: false })
  targetId?: string | null | undefined
}

export type DataRefDocument = DataRefModel & Document
export const DataRefSchema = SchemaFactory.createForClass(DataRefModel)
