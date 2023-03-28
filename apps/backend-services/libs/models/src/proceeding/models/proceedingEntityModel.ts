import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ProceedingEntityInvolved } from 'defs'
import { Types } from 'mongoose'
import { MetadataModel, MetadataSchema } from '@app/models/metadata/models/metadataModel'
import { CompanyDocument, CompanyModel } from '@app/models/company/models/companyModel'
import { PersonDocument, PersonModel } from '@app/models/person/models/personModel'

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