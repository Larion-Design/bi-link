import { LocationIndex } from '@app/definitions/search/location'
import { Property, PropertyListRecord, RealEstateInfo, VehicleInfo } from 'defs'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
} from '@app/definitions/search/connectedEntity'
import { EmbeddedFileIndex } from '@app/definitions/search/file'

export interface PropertyIndex extends Pick<Property, 'name' | 'type' | 'customFields'> {
  personsOwners: ConnectedPersonIndex[]
  companiesOwners: ConnectedCompanyIndex[]
  files: EmbeddedFileIndex[]
  vehicleInfo?: VehicleInfoIndex
  realEstateInfo?: RealEstateInfoIndex
}

export interface VehicleInfoIndex extends VehicleInfo {
  plateNumbers: string[]
}

export interface RealEstateInfoIndex extends Omit<RealEstateInfo, 'location' | 'townArea'> {
  location: LocationIndex
}

export interface PropertySearchIndex extends Pick<PropertyListRecord, 'name' | 'type'> {}
