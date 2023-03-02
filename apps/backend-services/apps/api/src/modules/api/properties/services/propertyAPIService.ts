import { RealEstateInfoModel } from '@app/models/models/property/realEstateInfoModel'
import { Injectable } from '@nestjs/common'
import { PropertiesService } from '@app/models/services/propertiesService'
import { PropertyAPIInput } from 'defs'
import { PropertyModel } from '@app/models/models/property/propertyModel'
import { LocationAPIService } from '../../common/services/locationAPIService'
import { PropertyOwnerAPIService } from './propertyOwnerAPIService'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { VehicleInfoModel } from '@app/models/models/property/vehicleInfoModel'
import { FileAPIService } from '../../files/services/fileAPIService'

@Injectable()
export class PropertyAPIService {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertyOwnerAPIService: PropertyOwnerAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly fileAPIService: FileAPIService,
    private readonly locationAPIService: LocationAPIService,
  ) {}

  createProperty = async (propertyInfo: PropertyAPIInput) => {
    const propertyModel = await this.createPropertyModel(propertyInfo)
    const propertyDocument = await this.propertiesService.create(propertyModel)
    return String(propertyDocument._id)
  }

  updateProperty = async (propertyId: string, propertyInfo: PropertyAPIInput) => {
    const propertyModel = await this.createPropertyModel(propertyInfo)
    await this.propertiesService.update(propertyId, propertyModel)
    return true
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
      realEstateInfoModel.location = await this.locationAPIService.getLocationModel(location)
      propertyModel.realEstateInfo = realEstateInfoModel
    }
    return propertyModel
  }
}
