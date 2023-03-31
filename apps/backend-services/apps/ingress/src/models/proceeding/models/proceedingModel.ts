import { Document, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Proceeding } from 'defs'
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from 'src/metadata/models/numberValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from 'src/metadata/models/textValueWithMetadataModel'
import {
  ProceedingEntityModel,
  ProceedingEntitySchema,
} from 'src/proceeding/models/proceedingEntityModel'

import { FileModel } from 'src/file/models/fileModel'
import { CustomFieldModel, CustomFieldSchema, MetadataModel, MetadataSchema } from 'src/index'

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
