import { Coordinates, EntityMetadata } from 'defs'

export interface LocationGraphNode extends EntityMetadata, Partial<Coordinates> {
  address: string
}
