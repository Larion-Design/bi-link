import { LocationAPIInput, locationSchema } from 'defs'

export const validateLocationsStructure = (locations: unknown[]) => {
  if (!locationSchema.parse(locations)) {
    return 'Una din adresele introduse este invalida.'
  }
}

export const validateLocationStructure = (locations: unknown) => {
  if (!locationSchema.parse(locations)) {
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
