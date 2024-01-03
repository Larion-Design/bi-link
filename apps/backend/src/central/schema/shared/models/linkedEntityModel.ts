import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { EventDocument, EventModel } from '../../event/models/eventModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { ProceedingDocument, ProceedingModel } from '../../proceeding/models/proceedingModel'
import { PropertyDocument, PropertyModel } from '../../property/models/propertyModel'

@Schema({ _id: false, timestamps: false })
export class LinkedEntityModel {
  @Prop({
    type: Types.ObjectId,
    ref: PersonModel.name,
    isRequired: false,
    index: true,
    sparse: true,
  })
  person?: PersonDocument

  @Prop({
    type: Types.ObjectId,
    ref: CompanyModel.name,
    isRequired: false,
    index: true,
    sparse: true,
  })
  company?: CompanyDocument

  @Prop({
    type: Types.ObjectId,
    ref: PropertyModel.name,
    isRequired: false,
    index: true,
    sparse: true,
  })
  property?: PropertyDocument

  @Prop({
    type: Types.ObjectId,
    ref: EventModel.name,
    isRequired: false,
    index: true,
    sparse: true,
  })
  event?: EventDocument

  @Prop({
    type: Types.ObjectId,
    ref: ProceedingModel.name,
    isRequired: false,
    index: true,
    sparse: true,
  })
  proceeding?: ProceedingDocument
}

export const LinkedEntitySchema = SchemaFactory.createForClass(LinkedEntityModel)
