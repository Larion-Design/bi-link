import { Injectable } from '@nestjs/common'
import { LocationIndex } from '@app/definitions/search/location'
import { LocationDocument } from '@app/models/models/locationModel'

@Injectable()
export class LocationIndexerService {
  createLocationIndexData = ({
    street,
    number,
    building,
    door,
    locality,
    county,
    country,
    zipCode,
    otherInfo,
    coordinates: { lat, long: lon },
  }: LocationDocument): LocationIndex => ({
    address: [street, number, building, door, locality, county, country, zipCode, otherInfo]
      .join(' ')
      .trim(),
    coordinates: {
      lat,
      lon,
    },
  })

  createLocationsIndexData = (locations: LocationDocument[]) =>
    locations?.map(this.createLocationIndexData)
}
