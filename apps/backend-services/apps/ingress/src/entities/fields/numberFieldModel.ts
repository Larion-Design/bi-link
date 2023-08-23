import { NumberField } from 'defs'

export class NumberFieldModel implements NumberField {
  _fieldId: string
  _groupId: string | null | undefined
  _id: string
  _type: 'number'
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
  value: number
}
