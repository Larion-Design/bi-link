import { EntityMetadata, Property } from 'defs'

export interface PropertyGraphNode
  extends Required<Pick<Property, 'type' | 'name'>>,
    EntityMetadata {
  vin?: string
  plateNumbers?: string[]
}
