import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { createHash } from 'crypto'
import { ClientSession, Model } from 'mongoose'
import { LocationDocument, LocationModel } from '../models/locationModel'

@Injectable()
export class LocationsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(LocationsService.name)

  constructor(
    @InjectModel(LocationModel.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async onApplicationBootstrap() {
    const locationDocuments = await this.locationModel.find()

    await Promise.all(
      locationDocuments.map(async (locationDocument) => {
        locationDocument.locationId = this.getLocationId(locationDocument)
        await locationDocument.save()
      }),
    )
  }

  async getAllLocations(): Promise<LocationDocument[]> {
    return this.locationModel.find().exec()
  }

  async getLocations(locationsIds: string[]) {
    if (locationsIds.length) {
      return this.locationModel.find({ locationId: locationsIds }).exec()
    }
    return []
  }

  async getLocation(locationId: string) {
    return this.locationModel.findOne({ locationId }).exec()
  }

  async upsertLocation(
    locationModel: LocationModel,
    session?: ClientSession,
  ): Promise<LocationDocument | null> {
    return this.locationModel.findOneAndUpdate(
      { locationId: this.getLocationId(locationModel) },
      locationModel,
      { new: true, upsert: true, session },
    )
  }

  async upsertLocations(locations: LocationModel[]) {
    const transactionSession = await this.locationModel.startSession()
    const locationsModels = await Promise.all(
      locations.map(async (location) => this.upsertLocation(location, transactionSession)),
    )
    await transactionSession.endSession()

    if (locationsModels) {
      return locationsModels.filter((location) => !!location) as LocationDocument[]
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
    coordinates: { lat = 0, long = 0 },
  }: LocationModel) => {
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
      .map((locationDetail) => String(locationDetail).toLowerCase().trim())
      .join('')

    return createHash('sha256').update(formattedLocationString).digest('hex')
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
