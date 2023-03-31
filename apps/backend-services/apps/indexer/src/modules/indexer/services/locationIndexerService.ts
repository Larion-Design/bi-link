import { Injectable } from '@nestjs/common'
import { Location } from 'defs'
import { formatAddress } from 'tools'
import { LocationIndex } from '@app/definitions'

@Injectable()
export class LocationIndexerService {
  createLocationIndexData = (locationInfo: Location): LocationIndex => ({
    address: formatAddress(locationInfo),
    coordinates: {
      lat: locationInfo.coordinates.lat,
      lon: locationInfo.coordinates.long,
    },
  })

  createLocationsIndexData = (locations: Location[]) => locations?.map(this.createLocationIndexData)
}
