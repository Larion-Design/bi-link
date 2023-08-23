import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { BaseFieldMetadata } from 'defs'

@Schema({ _id: false, timestamps: false })
export class BaseFieldMetadataModel implements BaseFieldMetadata {
  @Prop({ required: false })
  unique?: boolean

  @Prop({ required: false })
  required: boolean

  @Prop({ required: false })
  graphIndex: boolean

  @Prop({ required: false })
  searchIndex: boolean
}

export const BaseFieldMetadataSchema = SchemaFactory.createForClass(BaseFieldMetadataModel)
