import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Graph } from 'defs'

@Schema({ timestamps: false, _id: false })
export class GraphModel implements Graph {
  @Prop()
  label: string
}

export const GraphSchema = SchemaFactory.createForClass(GraphModel)
