import { NodesRelationship } from '../entitiesGraph'
import { Coordinates, CoordinatesAPI } from './coordinates'

export interface Location {
  _id?: string
  locationId: string
  street: string
  number: string
  building: string
  door: string
  zipCode: string
  locality: string
  county: string
  country: string
  otherInfo: string
  coordinates: Coordinates
}

export interface LocationAPIInput extends Location {
  coordinates: CoordinatesAPI
}
export interface LocationAPIOutput extends Required<Location> {
  coordinates: CoordinatesAPI
}

export interface EntityLocationRelationship extends NodesRelationship {}