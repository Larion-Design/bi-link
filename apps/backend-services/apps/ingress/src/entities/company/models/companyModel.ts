import { MetadataModel, MetadataSchema } from 'src/metadata/models/metadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from 'src/metadata/models/textValueWithMetadataModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { CustomFieldModel, CustomFieldSchema } from '../../cusotmField/models/customFieldModel'
import { FileModel } from '../../file/models/fileModel'
import { AssociateModel, AssociateSchema } from './associateModel'
import { LocationDocument, LocationModel } from '../../location/models/locationModel'
import { Company } from 'defs'

@Schema({ timestamps: true })
export class CompanyModel implements Company {
  _id: string

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

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type CompanyDocument = CompanyModel & Document<string>
export const CompanySchema = SchemaFactory.createForClass(CompanyModel)
