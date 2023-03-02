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
    coordinates: { lat, long },
  }: LocationDocument): LocationIndex => ({
    address: [street, number, building, door, locality, county, country, zipCode, otherInfo]
      .join(' ')
      .trim(),
    coordinates: {
      lat,
      lon: long,
    },
  })

  createLocationsIndexData = (locations: LocationDocument[]) =>
    locations.map(this.createLocationIndexData)
}
