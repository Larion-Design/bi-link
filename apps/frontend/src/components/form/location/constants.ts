import { LocationAPIInput } from 'defs'

export const defaultLocation: LocationAPIInput = {
  street: '',
  number: '',
  building: '',
  door: '',
  locality: '',
  zipCode: '',
  county: '',
  country: 'Romania',
  otherInfo: '',
  locationId: '',
  coordinates: {
    lat: 0,
    long: 0,
  },
}
