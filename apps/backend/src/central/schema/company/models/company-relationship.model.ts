import {
  CustomFieldModel,
  CustomFieldSchema,
} from '@modules/central/schema/customField/models/customFieldModel'
import {
  MetadataModel,
  MetadataSchema,
} from '@modules/central/schema/metadata/models/metadataModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CompanyRelationship, CompanyRelationshipType, ConnectedEntity } from 'defs'
import { Types } from 'mongoose'

@Schema({ _id: false, timestamps: false })
export class CompanyRelationshipModel implements CompanyRelationship {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  type: CompanyRelationshipType

  @Prop({
    type: Types.ObjectId,
    ref: 'PersonModel',
    isRequired: false,
    index: true,
    sparse: true,
  })
  person?: ConnectedEntity

  @Prop({
    type: Types.ObjectId,
    ref: 'CompanyModel',
    isRequired: false,
    index: true,
    sparse: true,
  })
  company?: ConnectedEntity

  @Prop({ type: [CustomFieldSchema], default: [] })
  customFields: CustomFieldModel[]
}

export const CompanyRelationshipSchema = SchemaFactory.createForClass(CompanyRelationshipModel)
