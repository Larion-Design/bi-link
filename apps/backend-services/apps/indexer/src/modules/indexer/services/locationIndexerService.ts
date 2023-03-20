import { Injectable } from '@nestjs/common'
import { formatAddress } from 'tools'
import { LocationIndex } from '@app/definitions'
import { LocationDocument } from '@app/models'

@Injectable()
export class LocationIndexerService {
  createLocationIndexData = (locationInfo: LocationDocument): LocationIndex => ({
    address: formatAddress(locationInfo),
    coordinates: {
      lat: locationInfo.coordinates.lat,
      lon: locationInfo.coordinates.long,
    },
  })

  createLocationsIndexData = (locations: LocationDocument[]) =>
    locations?.map(this.createLocationIndexData)
}
