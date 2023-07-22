import { Location } from 'defs'

export const formatAddress = ({
  street,
  number,
  building,
  door,
  locality,
  county,
  country,
  zipCode,
  otherInfo,
}: Partial<Location>) =>
  [street, number, building, door, locality, county, country, zipCode, otherInfo].join(' ').trim()
