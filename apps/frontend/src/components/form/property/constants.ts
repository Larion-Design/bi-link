import { PropertyAPIInput, RealEstateAPIInput, VehicleInfoAPIInput } from 'defs'

export const getDefaultProperty = (): PropertyAPIInput => ({
  name: '',
  type: '',
  images: [],
  owners: [],
  files: [],
  customFields: [],
  vehicleInfo: null,
  realEstateInfo: null,
})

export const createVehicleInfo = (): VehicleInfoAPIInput => ({
  vin: '',
  maker: '',
  model: '',
  color: '',
})

export const createRealEstateInfo = (): RealEstateAPIInput => ({
  surface: 0,
  townArea: true,
  location: null,
})
