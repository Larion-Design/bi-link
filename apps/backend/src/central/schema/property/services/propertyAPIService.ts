import { Injectable, Logger } from '@nestjs/common'
import { PropertyAPIInput, UpdateSource } from 'defs'
import { LocationAPIService } from '../../location/services/locationAPIService'
import { PropertyModel } from '../models/propertyModel'
import { RealEstateInfoModel } from '../models/realEstateInfoModel'
import { VehicleInfoModel } from '../models/vehicleInfoModel'
import { PropertiesService } from './propertiesService'
import { PropertyHistorySnapshotService } from './propertyHistorySnapshotService'
import { PropertyOwnerAPIService } from './propertyOwnerAPIService'
import { CustomFieldsService } from '../../customField/services/customFieldsService'
import { FileAPIService } from '../../file/services/fileAPIService'
import { PropertyPendingSnapshotService } from './propertyPendingSnapshotService'

@Injectable()
export class PropertyAPIService {
  private readonly logger = new Logger(PropertyAPIService.name)

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertyOwnerAPIService: PropertyOwnerAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly fileAPIService: FileAPIService,
    private readonly locationAPIService: LocationAPIService,
    private readonly propertyPendingSnapshotService: PropertyPendingSnapshotService,
    private readonly propertyHistorySnapshotService: PropertyHistorySnapshotService,
  ) {}

  createProperty = async (propertyInfo: PropertyAPIInput) => {
    const propertyModel = await this.createPropertyModel(propertyInfo)
    const propertyDocument = await this.propertiesService.create(propertyModel)

    if (propertyDocument) {
      return String(propertyDocument._id)
    }
  }

  updateProperty = async (propertyId: string, propertyInfo: PropertyAPIInput) => {
    const propertyModel = await this.createPropertyModel(propertyInfo)
    await this.propertiesService.update(propertyId, propertyModel)
    return true
  }

  createPendingSnapshot = async (
    entityId: string,
    data: PropertyAPIInput,
    source: UpdateSource,
  ) => {
    try {
      const propertyModel = await this.createPropertyModel(data)
      const snapshotModel = await this.propertyPendingSnapshotService.create(
        entityId,
        propertyModel,
        source,
      )

      if (snapshotModel) {
        return String(snapshotModel._id)
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  createHistorySnapshot = async (
    entityId: string,
    data: PropertyAPIInput,
    source: UpdateSource,
  ) => {
    try {
      const propertyModel = await this.createPropertyModel(data)
      const snapshotModel = await this.propertyHistorySnapshotService.create(
        entityId,
        propertyModel,
        source,
      )

      if (snapshotModel) {
        return String(snapshotModel._id)
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  private createPropertyModel = async (propertyInfo: PropertyAPIInput) => {
    const propertyModel = new PropertyModel()
    propertyModel.name = propertyInfo.name
    propertyModel.type = propertyInfo.type

    if (propertyInfo.owners.length) {
      propertyModel.owners = await this.propertyOwnerAPIService.getPropertyOwnersModels(
        propertyInfo.owners,
      )
    }

    if (propertyInfo.customFields.length) {
      propertyModel.customFields = this.customFieldsService.createCustomFieldsModels(
        propertyInfo.customFields,
      )
    }

    if (propertyInfo.files.length) {
      propertyModel.files = await this.fileAPIService.getUploadedFilesModels(propertyInfo.files)
    }
    if (propertyInfo.images.length) {
      propertyModel.images = await this.fileAPIService.getUploadedFilesModels(propertyInfo.images)
    }

    if (propertyInfo.vehicleInfo) {
      const vehicleInfoModel = new VehicleInfoModel()
      const { maker, model, vin, color } = propertyInfo.vehicleInfo

      vehicleInfoModel.model = model
      vehicleInfoModel.maker = maker
      vehicleInfoModel.vin = vin
      vehicleInfoModel.color = color

      propertyModel.vehicleInfo = vehicleInfoModel
    } else if (propertyInfo.realEstateInfo) {
      const realEstateInfoModel = new RealEstateInfoModel()
      const { surface, townArea, location } = propertyInfo.realEstateInfo

      realEstateInfoModel.surface = surface
      realEstateInfoModel.townArea = townArea
      realEstateInfoModel.location = location
        ? (await this.locationAPIService.getLocationModel(location)) ?? null
        : null
      propertyModel.realEstateInfo = realEstateInfoModel
    }
    return propertyModel
  }
}
