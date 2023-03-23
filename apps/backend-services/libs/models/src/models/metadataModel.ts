import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false, timestamps: false })
export class MetadataModel {
  @Prop({ isRequired: false })
  confirmed?: boolean

  @Prop({ isRequired: false })
  access?: string
}
