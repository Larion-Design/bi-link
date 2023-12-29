import { INDEX_PROPERTIES } from '@modules/search/constants'
import { MappingValidatorService } from '@modules/search/services/mapping/mappingValidatorService'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { PropertyIndex } from '@modules/definitions'
import { Record } from 'neo4j-driver'
import { MappingInterface } from './mapping'
import { MappingHelperService } from './mappingHelperService'

@Injectable()
export class PropertiesMappingService
  implements MappingInterface<PropertyIndex>, OnApplicationBootstrap
{
  constructor(
    private readonly mappingHelperService: MappingHelperService,
    private readonly mappingValidatorService: MappingValidatorService,
  ) {}

  getMapping = (): Record<keyof PropertyIndex, MappingProperty> => ({
    name: this.mappingHelperService.textField,
    type: this.mappingHelperService.keywordField,
    customFields: this.mappingHelperService.customFields,
    files: this.mappingHelperService.files,
    personsOwners: this.mappingHelperService.connectedPerson,
    companiesOwners: this.mappingHelperService.connectedCompany,
    vehicleInfo: {
      type: 'nested',
      properties: {
        vin: this.mappingHelperService.keywordField,
        maker: this.mappingHelperService.keywordField,
        model: this.mappingHelperService.keywordField,
        color: this.mappingHelperService.keywordField,
        plateNumbers: this.mappingHelperService.keywordField,
      },
    },
    realEstateInfo: {
      type: 'nested',
      properties: {
        surface: this.mappingHelperService.textField,
        location: this.mappingHelperService.location,
      },
    },
  })

  async onApplicationBootstrap() {
    await this.mappingValidatorService.initIndex(INDEX_PROPERTIES, this.getMapping())
  }
}
