import { Injectable, Logger } from '@nestjs/common'
import { LocationAPIInput } from 'defs'
import { CoordinatesModel } from '../models/coordinatesModel'
import { LocationModel } from '../models/locationModel'
import { LocationsService } from './locationsService'

@Injectable()
export class LocationAPIService {
  private readonly logger = new Logger(LocationAPIService.name)

  constructor(private readonly locationsService: LocationsService) {}

  getLocationModel = async (location: LocationAPIInput) => {
    try {
      const locationModel = this.createLocationModel(location)

      if (locationModel) {
        return this.locationsService.upsertLocation(locationModel)
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  getLocationsModels = async (locationsInfo: LocationAPIInput[]) => {
    try {
      const locationsModels = locationsInfo
        .map(this.createLocationModel)
        .filter((locationModel) => !!locationModel)

      return locationsModels.length ? this.locationsService.upsertLocations(locationsModels) : []
    } catch (error) {
      this.logger.error(error)
    }
  }

  createLocationModel = (location: LocationAPIInput) => {
    const { lat, long } = location.coordinates
    const coordinatesModel = new CoordinatesModel()
    coordinatesModel.lat = lat ?? 0
    coordinatesModel.long = long ?? 0

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
    locationModel.coordinates = coordinatesModel

    if (this.locationsService.isValidLocation(locationModel)) {
      locationModel.locationId = this.locationsService.getLocationId(locationModel)
      return locationModel
    } else throw new Error('Location is invalid')
  }
}