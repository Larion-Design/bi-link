import {
  CompanyRelationshipModel,
  CompanyRelationshipSchema,
} from '@modules/central/schema/company/models/company-relationship.model'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'
import { CustomFieldModel, CustomFieldSchema } from '../../customField/models/customFieldModel'
import { FileModel, FileSchema } from '../../file/models/fileModel'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from '../../metadata/models/optionalDateValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '../../metadata/models/textValueWithMetadataModel'
import { AssociateModel, AssociateSchema } from './associateModel'
import { LocationDocument, LocationModel } from '../../location/models/locationModel'
import { Company } from 'defs'
import { BalanceSheetModel, BalanceSheetSchema } from './balanceSheetModel'
import { CompanyActiveStateModel, CompanyActiveStateSchema } from './companyActiveStateModel'
import { CompanyStatusModel, CompanyStatusSchema } from './companyStatusModel'

@Schema({ _id: true, timestamps: true, strict: 'throw' })
export class CompanyModel implements Company {
  _id: string
  createdAt?: Date
  updatedAt?: Date

  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  cui: TextValueWithMetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  name: TextValueWithMetadataModel

  @Prop({ type: Types.ObjectId, ref: LocationModel.name, isRequired: false })
  headquarters: LocationDocument | null

  @Prop({ type: [{ type: Types.ObjectId, ref: LocationModel.name }] })
  locations: LocationDocument[]

  @Prop({ type: TextValueWithMetadataSchema })
  registrationNumber: TextValueWithMetadataModel

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  contactDetails: CustomFieldModel[]

  @Prop({ type: [AssociateSchema], isRequired: false })
  associates: AssociateModel[]

  @Prop({
    type: [{ type: Types.ObjectId, ref: FileModel.name }],
  })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]

  @Prop({ type: [BalanceSheetSchema] })
  balanceSheets: BalanceSheetModel[]

  @Prop({ type: CompanyActiveStateSchema })
  active: CompanyActiveStateModel

  @Prop({ type: CompanyStatusSchema })
  status: CompanyStatusModel

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  registrationDate: OptionalDateValueWithMetadataModel

  @Prop({ type: [CustomFieldSchema], default: [] })
  activityCodes: CustomFieldModel[]

  @Prop({ type: [FileSchema], default: [] })
  images?: FileModel[]

  @Prop({ type: [CompanyRelationshipSchema] })
  relationships?: CompanyRelationshipModel[]
}

export type CompanyDocument = HydratedDocument<CompanyModel>
export const CompanySchema = SchemaFactory.createForClass(CompanyModel)
