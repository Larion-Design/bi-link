import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ProceedingEntityInvolved } from 'defs'
import { Types } from 'mongoose'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'

@Schema({ _id: true, timestamps: false })
export class ProceedingEntityModel implements ProceedingEntityInvolved {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({
    type: Types.ObjectId,
    ref: PersonModel.name,
    isRequired: false,
    index: true,
  })
  person?: PersonDocument

  @Prop({
    type: Types.ObjectId,
    ref: CompanyModel.name,
    isRequired: false,
    index: true,
  })
  company?: CompanyDocument

  @Prop()
  description: string

  @Prop()
  involvedAs: string
}

export const ProceedingEntitySchema = SchemaFactory.createForClass(ProceedingEntityModel)
