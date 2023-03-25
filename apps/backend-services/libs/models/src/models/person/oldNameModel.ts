import { MetadataModel, MetadataSchema } from '@app/models/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OldName } from 'defs'

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
