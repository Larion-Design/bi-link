import { CustomField, CustomFieldAPI } from './customField'
import { PropertyOwner, PropertyOwnerAPI } from './propertyOwner'
import { EmbeddedFileIndex, FileAPIInput, FileAPIOutput } from './file'
import { ConnectedCompanyIndex, ConnectedPersonIndex } from './connectedEntity'

export interface Property {
  _id?: string
  name: string
  type: string
  customFields: CustomField[]
  files: File[]
  images: File[]
  owners: PropertyOwner[]
  vehicleInfo: VehicleInfo | null
}

export interface VehicleInfo {
  vin: string
  maker: string
  model: string
  color: string
}

export interface VehicleInfoIndex extends VehicleInfo {
  plateNumbers: string[]
}

export interface PropertyAPIInput extends Omit<Property, '_id' | 'owners' | 'files' | 'images'> {
  customFields: CustomFieldAPI[]
  files: FileAPIInput[]
  images: FileAPIInput[]
  owners: PropertyOwnerAPI[]
}

export interface PropertyAPIOutput
  extends Required<Omit<Property, 'owners' | 'files' | 'customFields' | 'images'>> {
  owners: PropertyOwnerAPI[]
  files: FileAPIOutput[]
  images: FileAPIOutput[]
  customFields: CustomFieldAPI[]
}

export interface PropertyIndex extends Pick<Property, 'name' | 'type' | 'customFields'> {
  personsOwners: ConnectedPersonIndex[]
  companiesOwners: ConnectedCompanyIndex[]
  files: EmbeddedFileIndex[]
  vehicleInfo?: VehicleInfoIndex
}

export interface PropertySearchIndex extends Pick<Property, 'name' | 'type'> {}

export interface PropertyListRecord extends Pick<PropertyAPIOutput, '_id'>, PropertySearchIndex {}

export type PropertiesSuggestions = {
  total: number
  records: PropertyListRecord[]
}
