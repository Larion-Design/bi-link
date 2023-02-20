import { Property, PropertyListRecord, VehicleInfo } from 'defs'
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
}

export interface VehicleInfoIndex extends VehicleInfo {
  plateNumbers: string[]
}

export interface PropertySearchIndex extends Pick<PropertyListRecord, 'name' | 'type'> {}
