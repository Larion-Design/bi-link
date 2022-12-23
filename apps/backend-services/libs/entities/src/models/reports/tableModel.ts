import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Table } from '@app/definitions/reports/table'

@Schema({ timestamps: false, _id: false })
export class TableModel implements Table {
  @Prop()
  id: string
}

export const TableSchema = SchemaFactory.createForClass(TableModel)
