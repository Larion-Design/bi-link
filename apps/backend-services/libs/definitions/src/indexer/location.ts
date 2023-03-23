import { Coordinates } from 'defs'

export type CoordinatesIndex = Pick<Coordinates, 'lat'> & {
  lon: Coordinates['long']
}

export type LocationIndex = {
  address: string
  coordinates: CoordinatesIndex
}
