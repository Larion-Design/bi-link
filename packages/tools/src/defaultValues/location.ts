import { v4 } from 'uuid'
import { LocationAPIInput } from 'defs'
import { getDefaultMetadata } from './metadata'

export const getDefaultLocation = (): LocationAPIInput => ({
  metadata: getDefaultMetadata(),
  street: '',
  number: '',
  building: '',
  door: '',
  locality: '',
  zipCode: '',
  county: '',
  country: 'Romania',
  otherInfo: '',
  locationId: v4(),
  coordinates: {
    lat: 0,
    long: 0,
  },
})
