import { EntityMetadata } from '@app/definitions/entitiesGraph'
import { Property } from '@app/definitions/property'

export interface PropertyGraphNode
  extends Required<Pick<Property, 'type' | 'name'>>,
    EntityMetadata {
  vin?: string
  plateNumbers?: string[]
}
