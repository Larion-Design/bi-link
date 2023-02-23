import * as yup from 'yup'
import { LocationAPIInput } from 'defs'

const locationsFormat = yup.array().of(
  yup.object().shape({
    address: yup.string().min(3),
    isActive: yup.boolean(),
  }),
)

export const validateLocationsStructure = (locations: unknown[]) => {
  if (!locationsFormat.isValidSync(locations)) {
    return 'Adresa unuia din punctele de lucru este prea scurta.'
  }
}

export const validateLocations = async (locations: LocationAPIInput[]) => {
  const error = validateLocationsStructure(locations)
  return Promise.resolve(error)
}

export const validateLocation = async (location: LocationAPIInput[]) => {
  const error = validateLocationsStructure(locations)
  return Promise.resolve(error)
}
