import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from '@app/models/models/generic/numberValueWithMetadataModel'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '@app/models/models/generic/textValueWithMetadataModel'
import { Document, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Proceeding } from 'defs'
import {
  ProceedingEntityModel,
  ProceedingEntitySchema,
} from '@app/models/models/proceeding/proceedingEntityModel'

import { FileModel } from '@app/models/models/fileModel'
import { CustomFieldModel, CustomFieldSchema, MetadataModel, MetadataSchema } from '@app/models'

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
}

export type ProceedingDocument = ProceedingModel & Document<string>
export const ProceedingSchema = SchemaFactory.createForClass(ProceedingModel)
