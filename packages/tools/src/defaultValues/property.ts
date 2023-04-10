import { PropertyAPIInput, PropertyOwnerAPI, RealEstateInfo, VehicleInfoAPI } from 'defs'
import { getDefaultMetadata } from './metadata'
import {
  getDefaultBooleanWithMetadata,
  getDefaultNumberWithMetadata,
  getDefaultOptionalDateWithMetadata,
  getDefaultTextWithMetadata,
} from './valueWithMetadata'

export const getDefaultProperty = (): PropertyAPIInput => ({
  metadata: getDefaultMetadata(),
  name: '',
  type: '',
  images: [],
  files: [],
  customFields: [],
  owners: [],
})

export const getDefaultVehicle = (): VehicleInfoAPI => ({
  vin: getDefaultTextWithMetadata(),
  maker: getDefaultTextWithMetadata(),
  model: getDefaultTextWithMetadata(),
  color: getDefaultTextWithMetadata(),
})

export const getDefaultRealEstate = (): RealEstateInfo => ({
  surface: getDefaultNumberWithMetadata(),
  townArea: getDefaultBooleanWithMetadata(),
  location: null,
})

export const getDefaultOwner = (): PropertyOwnerAPI => ({
  metadata: getDefaultMetadata(),
  startDate: getDefaultOptionalDateWithMetadata(),
  endDate: getDefaultOptionalDateWithMetadata(),
  customFields: [],
})
