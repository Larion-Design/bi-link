import { Document, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Proceeding } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../../customField/models/customFieldModel'
import { FileModel } from '../../file/models/fileModel'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from '../../metadata/models/numberValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '../../metadata/models/textValueWithMetadataModel'
import { ProceedingEntityModel, ProceedingEntitySchema } from './proceedingEntityModel'

@Schema({ timestamps: true })
export class ProceedingModel implements Proceeding {
  _id: string

  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  name: string

  @Prop()
  type: string

  @Prop({ type: TextValueWithMetadataSchema })
  fileNumber: TextValueWithMetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  reason: TextValueWithMetadataModel

  @Prop({ type: NumberValueWithMetadataSchema })
  year: NumberValueWithMetadataModel

  @Prop()
  description: string

  @Prop({ type: [ProceedingEntitySchema] })
  entitiesInvolved: ProceedingEntityModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema] })
  customFields: CustomFieldModel[]

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type ProceedingDocument = ProceedingModel & Document<string>
export const ProceedingSchema = SchemaFactory.createForClass(ProceedingModel)
