import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ReportGraph } from 'defs'

@Schema({ timestamps: false, _id: false })
export class GraphModel implements ReportGraph {
  @Prop()
  label: string
}

export const GraphSchema = SchemaFactory.createForClass(GraphModel)
