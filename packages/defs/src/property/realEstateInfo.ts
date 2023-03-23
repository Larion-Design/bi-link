import { Location, LocationAPIInput, LocationAPIOutput } from '../geolocation'

export interface RealEstateInfo {
  surface: number
  townArea: boolean
  location: Location
}

export interface RealEstateAPIInput extends RealEstateInfo {
  location: LocationAPIInput
}

export interface RealEstateAPIOutput extends RealEstateInfo {
  location: LocationAPIOutput
}
