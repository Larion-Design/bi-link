import { CustomFieldModel, CustomFieldSchema } from '@app/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Proceeding } from 'defs'
import {
  ProceedingEntityModel,
  ProceedingEntitySchema,
} from '@app/models/models/proceeding/proceedingEntityModel'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class ProceedingModel implements Proceeding {
  _id: string

  @Prop()
  fileNumber: string

  @Prop()
  name: string

  @Prop()
  type: string

  @Prop()
  reason: string

  @Prop()
  year: number

  @Prop()
  description: string

  @Prop({ type: [ProceedingEntitySchema], isRequired: false })
  entitiesInvolved: ProceedingEntityModel[]

  @Prop({ type: [CustomFieldSchema] })
  customFields: CustomFieldModel[]
}

export type ProceedingDocument = ProceedingModel & Document<string>
export const ProceedingSchema = SchemaFactory.createForClass(ProceedingModel)
