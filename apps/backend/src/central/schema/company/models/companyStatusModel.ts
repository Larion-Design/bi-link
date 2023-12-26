import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CompanyStatus } from 'defs'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '../../metadata/models/textValueWithMetadataModel'

@Schema({ timestamps: false, _id: false })
export class CompanyStatusModel implements CompanyStatus {
  @Prop({ type: TextValueWithMetadataSchema })
  fiscal: TextValueWithMetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  vat: TextValueWithMetadataModel
}

export const CompanyStatusSchema = SchemaFactory.createForClass(CompanyStatusModel)
