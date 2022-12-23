import { Title } from '@app/definitions/reports/title'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: false, _id: false })
export class TitleModel implements Title {
  @Prop()
  content: string
}

export const TitleSchema = SchemaFactory.createForClass(TitleModel)
