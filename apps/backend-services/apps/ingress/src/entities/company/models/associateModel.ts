import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Associate } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../../customField/models/customFieldModel'
import {
  BooleanValueWithMetadataModel,
  BooleanValueWithMetadataSchema,
} from '../../metadata/models/booleanValueWithMetadataModel'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from '../../metadata/models/numberValueWithMetadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from '../../metadata/models/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '../../metadata/models/textValueWithMetadataModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { CompanyDocument } from './companyModel'

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
