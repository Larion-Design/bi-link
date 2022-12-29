import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false, timestamps: true })
export class MetadataModel {
  @Prop()
  confirmed?: boolean

  @Prop()
  public?: boolean
}
