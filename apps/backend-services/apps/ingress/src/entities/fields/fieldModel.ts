import { Schema } from '@nestjs/mongoose'
import { BaseField } from 'defs'

@Schema({ discriminatorKey: 'type' })
export class FieldModel implements BaseField {
  _id: string
  _fieldId: string
  _groupId: string | null | undefined
  createdAt: Date | undefined
  metadata: {
    graph: { index: boolean }
    rules: string[]
    db: { index: boolean }
    search: { index: boolean }
    unique?: boolean | null | undefined
    required?: boolean | null | undefined
  }
  name: string
  updatedAt: Date | undefined
}
