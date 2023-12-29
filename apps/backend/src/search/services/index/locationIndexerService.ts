import { Injectable } from '@nestjs/common'
import { Location } from 'defs'
import { LocationIndex } from '@modules/definitions'

@Injectable()
export class LocationIndexerService {
  createLocationIndexData = ({
    street,
    number,
    door,
    coordinates: { lat, long: lon },
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
    coordinates: {
      lat,
      lon,
    },
  })

  createLocationsIndexData = (locations: Location[]) => locations?.map(this.createLocationIndexData)
}
