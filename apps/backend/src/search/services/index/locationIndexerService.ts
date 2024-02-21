import { Injectable } from '@nestjs/common'
import { Location } from 'defs'
import { LocationIndex } from '@modules/definitions'

@Injectable()
export class LocationIndexerService {
  createLocationIndexData = ({
    street,
    number,
    door,
    coordinates: { lat = 0, long = 0 },
    otherInfo,
    county,
    locality,
    zipCode,
    building,
    country,
  }: Location): LocationIndex => ({
    street,
    number,
    door,
    otherInfo,
    county,
    locality,
    zipCode,
    building,
    country,
    coordinates: [Number(lat), Number(long)],
  })

  createLocationsIndexData = (locations: Location[]) => locations?.map(this.createLocationIndexData)

  createLocationsFullAddressIndex = (locations: Location[]) =>
    locations?.map(
      ({
        street,
        number,
        door,
        otherInfo,
        county,
        locality,
        zipCode,
        building,
        country,
      }: Location): string =>
        [street, number, door, otherInfo, county, locality, zipCode, building, country].join(' '),
    )
}
