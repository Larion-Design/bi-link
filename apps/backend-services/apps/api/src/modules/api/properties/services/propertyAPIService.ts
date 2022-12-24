import { Injectable } from '@nestjs/common'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { PropertyAPIInput } from 'defs'
import { PropertyModel } from '@app/entities/models/propertyModel'
import { PropertyOwnerAPIService } from './propertyOwnerAPIService'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { VehicleInfoModel } from '@app/entities/models/vehicleInfoModel'
import { FileAPIService } from '../../files/services/fileAPIService'

@Injectable()
export class PropertyAPIService {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertyOwnerAPIService: PropertyOwnerAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly fileAPIService: FileAPIService,
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
      propertyModel.customFields = this.customFieldsService.getCustomFieldsDocumentsForInputData(
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
    }
    return propertyModel
  }
}
