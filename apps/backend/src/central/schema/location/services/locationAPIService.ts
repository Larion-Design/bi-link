import { Injectable, Logger } from '@nestjs/common'
import { LocationAPIInput } from 'defs'
import { CoordinatesModel } from '../models/coordinatesModel'
import { LocationModel } from '../models/locationModel'
import { LocationsService } from './locationsService'

@Injectable()
export class LocationAPIService {
  private readonly logger = new Logger(LocationAPIService.name)

  constructor(private readonly locationsService: LocationsService) {}

  async getLocationModel(location: LocationAPIInput) {
    const locationModel = this.createLocationModel(location)

    if (locationModel) {
      return this.locationsService.upsertLocation(locationModel)
    }
  }

  async getLocationsModels(locationsInfo: LocationAPIInput[]) {
    const locationsModels: LocationModel[] = []

    locationsInfo.forEach((location) => {
      const model = this.createLocationModel(location)

      if (model) {
        locationsModels.push(model)
      }
    })

    return locationsModels.length ? this.locationsService.upsertLocations(locationsModels) : []
  }

  createLocationModel(location: LocationAPIInput) {
    const { lat, long } = location.coordinates
    const locationModel = new LocationModel()
    locationModel.street = location.street
    locationModel.number = location.number
    locationModel.building = location.building
    locationModel.door = location.door
    locationModel.locality = location.locality
    locationModel.county = location.county
    locationModel.country = location.country
    locationModel.zipCode = location.zipCode
    locationModel.otherInfo = location.otherInfo
    locationModel.coordinates = new CoordinatesModel(lat ?? 0, long ?? 0)
    locationModel.metadata = location.metadata

    if (this.locationsService.isValidLocation(locationModel)) {
      locationModel.locationId = this.locationsService.getLocationId(locationModel)
      return locationModel
    } else throw new Error('Location is invalid')
  }
}
