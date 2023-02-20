import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false, timestamps: false })
export class MetadataModel {
  @Prop()
  confirmed?: boolean

  @Prop()
  public?: boolean
}
