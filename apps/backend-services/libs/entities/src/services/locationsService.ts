import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { createHash } from 'crypto'
import { ClientSession, Model } from 'mongoose'
import { LocationDocument, LocationModel } from '@app/entities/models/locationModel'

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name)

  constructor(
    @InjectModel(LocationModel.name) private readonly locationModel: Model<LocationDocument>,
  ) {}

  upsertLocation = async (locationModel: LocationModel, session?: ClientSession) => {
    try {
      return this.locationModel.findOneAndUpdate(
        { locationId: this.getLocationId(locationModel) },
        locationModel,
        { new: true, upsert: true, session },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertLocations = async (locations: LocationModel[]) => {
    try {
      const transactionSession = await this.locationModel.startSession()
      const locationsModels = await Promise.all(
        locations.map(async (location) => this.upsertLocation(location, transactionSession)),
      )
      await transactionSession.endSession()
      return locationsModels.filter((location) => !!location)
    } catch (error) {
      this.logger.error(error)
    }
  }

  getLocationId = (location: LocationModel) => {
    const hash = createHash('sha256')
    hash.write([
      location.street,
      location.number,
      location.building,
      location.door,
      location.locality,
      location.county,
      location.country,
      location.zipCode,
      location.otherInfo,
      location.coordinates.lat,
      location.coordinates.long,
    ])
    return hash.digest('hex')
  }

  isValidLocation = ({
    street,
    number,
    door,
    building,
    county,
    country,
    locality,
    otherInfo,
    zipCode,
    coordinates: { lat, long },
  }: LocationModel) =>
    (lat && long) ||
    street.length ||
    number.length ||
    door.length ||
    building.length ||
    county.length ||
    country.length ||
    locality.length ||
    zipCode.length ||
    otherInfo.length
}
