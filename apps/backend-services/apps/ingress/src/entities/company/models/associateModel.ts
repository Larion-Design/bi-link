import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Associate } from 'defs'
import {
  BooleanValueWithMetadataModel,
  BooleanValueWithMetadataSchema,
  MetadataModel,
  MetadataSchema,
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
  PersonDocument,
  PersonModel,
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '@app/models/models'
import { CustomFieldModel, CustomFieldSchema } from '@app/models/models'
import { CompanyDocument } from 'src/company/models/companyModel'

@Schema({ _id: false, timestamps: false })
export class AssociateModel implements Associate {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  role: TextValueWithMetadataModel

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: 'CompanyModel', isRequired: false })
  company?: CompanyDocument

  @Prop({ type: NumberValueWithMetadataSchema })
  equity: NumberValueWithMetadataModel

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  startDate: OptionalDateValueWithMetadataModel

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  endDate: OptionalDateValueWithMetadataModel

  @Prop({ type: BooleanValueWithMetadataSchema })
  isActive: BooleanValueWithMetadataModel

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type AssociateDocument = AssociateModel & Document
export const AssociateSchema = SchemaFactory.createForClass(AssociateModel)
