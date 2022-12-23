import { Link } from '@app/definitions/reports/link'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: false, _id: false })
export class LinkModel implements Link {
  @Prop()
  label: string

  @Prop()
  url: string
}

export const LinkSchema = SchemaFactory.createForClass(LinkModel)
