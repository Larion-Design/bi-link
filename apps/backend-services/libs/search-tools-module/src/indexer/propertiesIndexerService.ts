import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
} from '@app/definitions/search/connectedEntity'
import { PropertyIndex } from '@app/definitions/search/property'
import { Injectable, Logger } from '@nestjs/common'
import { PropertyModel } from '@app/entities/models/property/propertyModel'
import { INDEX_PROPERTIES } from '@app/definitions/constants'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { PropertyOwnerModel } from '@app/entities/models/property/propertyOwnerModel'

@Injectable()
export class PropertiesIndexerService {
  private readonly index = INDEX_PROPERTIES
  private readonly logger = new Logger(PropertiesIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly propertiesService: PropertiesService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
  ) {}

  indexProperty = async (propertyId: string, propertyModel: PropertyModel) => {
    try {
      const { _id } = await this.elasticsearchService.index<PropertyIndex>({
        index: this.index,
        id: propertyId,
        document: this.createIndexData(propertyModel),
        refresh: true,
      })

      this.logger.debug(`Added ${propertyId} to index ${this.index}`)
      return _id === propertyId
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createIndexData = (propertyModel: PropertyModel): PropertyIndex => {
    const propertyIndex: PropertyIndex = {
      name: propertyModel.name,
      type: propertyModel.type,
      personsOwners: this.createPersonOwnersIndex(propertyModel.owners),
      companiesOwners: this.createCompanyOwnersIndex(propertyModel.owners),
      customFields: propertyModel.customFields,
      files: [],
    }

    if (propertyModel.vehicleInfo) {
      propertyIndex.vehicleInfo = {
        vin: propertyModel.vehicleInfo.vin,
        maker: propertyModel.vehicleInfo.maker,
        model: propertyModel.vehicleInfo.model,
        color: propertyModel.vehicleInfo.color,
        plateNumbers: Array.from(
          new Set<string>(
            [].concat(
              ...propertyModel.owners.map(({ vehicleOwnerInfo: { plateNumbers } }) => plateNumbers),
            ),
          ),
        ),
      }
    }
    return propertyIndex
  }

  private createPersonOwnersIndex = (owners: PropertyOwnerModel[]): ConnectedPersonIndex[] =>
    owners
      .filter(({ person }) => !!person)
      .map(({ person, customFields }) => ({
        ...this.connectedEntityIndexerService.createConnectedPersonIndex(person),
        customFields,
      }))

  private createCompanyOwnersIndex = (owners: PropertyOwnerModel[]): ConnectedCompanyIndex[] =>
    owners
      .filter(({ company }) => !!company)
      .map(({ company, customFields }) => ({
        ...this.connectedEntityIndexerService.createConnectedCompanyIndex(company),
        customFields,
      }))
}
