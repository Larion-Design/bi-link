import { MetadataModel, MetadataSchema } from '@app/models/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ProceedingEntityInvolved } from 'defs'
import { Types } from 'mongoose'
import { PersonModel, PersonDocument } from '../person'
import { CompanyModel, CompanyDocument } from '../company'

@Schema({ _id: false, timestamps: false })
export class ProceedingEntityModel implements ProceedingEntityInvolved {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: CompanyModel.name, isRequired: false })
  company?: CompanyDocument

  @Prop()
  description: string

  @Prop()
  involvedAs: string
}

export const ProceedingEntitySchema = SchemaFactory.createForClass(ProceedingEntityModel)
