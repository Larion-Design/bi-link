import * as yup from 'yup'
import { LocationAPIInput } from 'defs'

const locationFormat = yup.object().shape({
  locationId: yup.string(),
  street: yup.string(),
  number: yup.string(),
  building: yup.string(),
  door: yup.string(),
  zipCode: yup.string(),
  locality: yup.string(),
  county: yup.string(),
  country: yup.string(),
  otherInfo: yup.string(),
  coordinates: yup.object().shape({
    lat: yup.number(),
    long: yup.number(),
  }),
})

const locationsFormat = yup.array().of(locationFormat)

export const validateLocationsStructure = (locations: unknown[]) => {
  if (!locationsFormat.isValidSync(locations)) {
    return 'Una din adresele introduse este invalida.'
  }
}

export const validateLocationStructure = (locations: unknown) => {
  if (!locationsFormat.isValidSync(locations)) {
    return 'Adresa este invalida.'
  }
}

export const validateLocations = async (locations: LocationAPIInput[]) => {
  const error = validateLocationsStructure(locations)
  return Promise.resolve(error)
}

export const validateLocation = async (location: LocationAPIInput) => {
  const error = validateLocationStructure(location)
  return Promise.resolve(error)
}
