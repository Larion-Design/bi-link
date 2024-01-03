import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OldName } from 'defs'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'

@Schema({ timestamps: false })
export class OldNameModel implements OldName {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  name: string

  @Prop()
  changeReason: string
}

export const OldNameSchema = SchemaFactory.createForClass(OldNameModel)
