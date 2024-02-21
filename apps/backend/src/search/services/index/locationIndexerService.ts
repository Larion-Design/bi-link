import { Injectable } from '@nestjs/common'
import { Location } from 'defs'
import { LocationIndex } from '@modules/definitions'

@Injectable()
export class LocationIndexerService {
  createLocationIndexData = ({
    street,
    number,
    door,
    otherInfo,
    county,
    locality,
    zipCode,
    building,
    country,
  }: Location) =>
    [street, number, door, otherInfo, county, locality, zipCode, building, country].join(' ')

  createLocationsIndexData = (locations: Location[]) =>
    locations?.map((location) => this.createLocationIndexData(location) ?? '')
}
