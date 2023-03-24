import { CustomField, CustomFieldAPI } from '../customField'
import { File, FileAPIInput, FileAPIOutput } from '../file'
import { SearchSuggestions } from '../searchSuggestions'
import { PropertyOwner, PropertyOwnerAPI } from './propertyOwner'
import { RealEstateAPIInput, RealEstateAPIOutput, RealEstateInfo } from './realEstateInfo'
import { VehicleInfo, VehicleInfoAPIInput, VehicleInfoAPIOutput } from './vehicleInfo'

export interface Property {
  _id: string
  name: string
  type: string
  customFields: CustomField[]
  files: File[]
  images: File[]
  owners: PropertyOwner[]
  vehicleInfo: VehicleInfo | null
  realEstateInfo: RealEstateInfo | null
}

interface PropertyAPI
  extends Omit<
    Property,
    'owners' | 'files' | 'customFields' | 'images' | 'vehicleInfo' | 'realEstateInfo'
  > {}

export interface PropertyAPIInput extends Omit<PropertyAPI, '_id'> {
  customFields: CustomFieldAPI[]
  files: FileAPIInput[]
  images: FileAPIInput[]
  owners: PropertyOwnerAPI[]
  vehicleInfo: VehicleInfoAPIInput | null
  realEstateInfo: RealEstateAPIInput | null
}

export interface PropertyAPIOutput extends PropertyAPI {
  owners: PropertyOwnerAPI[]
  files: FileAPIOutput[]
  images: FileAPIOutput[]
  customFields: CustomFieldAPI[]
  vehicleInfo: VehicleInfoAPIOutput | null
  realEstateInfo: RealEstateAPIOutput | null
}

export interface PropertyListRecord extends Pick<Property, '_id' | 'name' | 'type'> {}

export interface PropertiesSuggestions extends SearchSuggestions<PropertyListRecord> {}
