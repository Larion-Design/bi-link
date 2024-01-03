import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { createHash } from 'crypto'
import { ClientSession, Model } from 'mongoose'
import { LocationDocument, LocationModel } from '../models/locationModel'

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name)

  constructor(
    @InjectModel(LocationModel.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  getLocations = async (locationsIds: string[]) => {
    try {
      if (locationsIds.length) {
        return this.locationModel.find({ locationId: locationsIds }).exec()
      }
    } catch (e) {
      this.logger.error(e)
    }
    return []
  }

  getLocation = async (locationId: string) => {
    try {
      return this.locationModel.findOne({ locationId }).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertLocation = async (
    locationModel: LocationModel,
    session?: ClientSession,
  ): Promise<LocationDocument | null> => {
    try {
      return this.locationModel.findOneAndUpdate(
        { locationId: this.getLocationId(locationModel) },
        locationModel,
        { new: true, upsert: true, session },
      )
    } catch (e) {
      this.logger.error(e)
    }
    return null
  }

  upsertLocations = async (locations: LocationModel[]) => {
    try {
      const transactionSession = await this.locationModel.startSession()
      const locationsModels = await Promise.all(
        locations.map(async (location) => this.upsertLocation(location, transactionSession)),
      )
      await transactionSession.endSession()

      if (locationsModels) {
        return locationsModels.filter((location) => !!location) as LocationDocument[]
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  getLocationId = ({
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
  }: LocationModel) => {
    const hash = createHash('sha256')

    if (
      street.length ||
      number.length ||
      door.length ||
      building.length ||
      county.length ||
      country.length ||
      locality.length ||
      zipCode.length ||
      lat ||
      long
    ) {
      const formattedLocationString = [
        street,
        number,
        building,
        door,
        locality,
        county,
        country,
        zipCode,
        otherInfo,
        lat,
        long,
      ]
        .map((locationDetail) => String(locationDetail).trim())
        .join(' ')

      hash.update(formattedLocationString)
    } else if (otherInfo.length) {
      hash.update(otherInfo)
    }
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
