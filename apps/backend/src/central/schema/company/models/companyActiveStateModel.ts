import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
  BooleanValueWithMetadataModel,
  BooleanValueWithMetadataSchema,
} from '../../metadata/models/booleanValueWithMetadataModel'

@Schema({ timestamps: false, _id: false })
export class CompanyActiveStateModel {
  @Prop({ type: BooleanValueWithMetadataSchema })
  ministryOfFinance: BooleanValueWithMetadataModel

  @Prop({ type: BooleanValueWithMetadataSchema })
  tradeRegister: BooleanValueWithMetadataModel
}

export const CompanyActiveStateSchema = SchemaFactory.createForClass(CompanyActiveStateModel)
