import { Injectable } from '@nestjs/common'
import { LocationModel } from '@app/entities/models/locationModel'
import { LocationInput } from '../dto/locationInput'

@Injectable()
export class LocationService {
  getLocationsDocumentsForInputData = (locations: LocationInput[]) =>
    locations.map((location) => new LocationModel(location))
}
