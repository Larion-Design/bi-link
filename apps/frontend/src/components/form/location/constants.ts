import { v4 } from 'uuid'

export const getDefaultLocation = () => ({
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
