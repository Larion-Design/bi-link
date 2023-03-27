import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OldName } from 'defs'
import { MetadataModel, MetadataSchema } from '@app/models/models/metadata/metadataModel'

@Schema({ _id: false, timestamps: false })
export class OldNameModel implements OldName {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop()
  name: string

  @Prop()
  changeReason: string
}

export const OldNameSchema = SchemaFactory.createForClass(OldNameModel)
