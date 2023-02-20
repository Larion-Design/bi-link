import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { CustomFieldModel, CustomFieldSchema } from '@app/entities/models/customFieldModel'
import { Education } from 'defs'

@Schema({ _id: false, timestamps: false })
export class EducationModel implements Education {
  @Prop()
  type: string

  @Prop()
  school: string

  @Prop()
  specialization: string

  @Prop({ type: SchemaTypes.Date, isRequired: false })
  startDate: Date | string | null

  @Prop({ type: SchemaTypes.Date, isRequired: false })
  endDate: Date | string | null

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export const EducationSchema = SchemaFactory.createForClass(EducationModel)
