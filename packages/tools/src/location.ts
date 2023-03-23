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
}: Location) =>
  [street, number, building, door, locality, county, country, zipCode, otherInfo].join(' ').trim()
