import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { PropertyIndex } from '@app/definitions/search/property'
import { MappingInterface } from '@app/search-tools-module/mapping/mapping'
import { MappingHelperService } from '@app/search-tools-module/mapping/mappingHelperService'

@Injectable()
export class PropertiesMappingService implements MappingInterface<PropertyIndex> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

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
}
