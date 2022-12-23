import { Injectable } from '@nestjs/common'
import { MappingInterface } from '@app/search-mapping-tools'
import { PropertyIndex } from '@app/definitions/property'
import { INDEX_PROPERTIES } from '@app/definitions/constants'
import { MappingHelperService } from '@app/search-mapping-tools/services/mapping/mappingHelperService'
import { MappingValidatorService } from '@app/search-mapping-tools/services/mapping/mappingValidatorService'
import { PropertiesIndexerService } from './propertiesIndexerService'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class PropertiesMappingService implements MappingInterface<PropertyIndex> {
  private readonly index = INDEX_PROPERTIES

  constructor(
    private readonly mappingHelperService: MappingHelperService,
    mappingValidatorService: MappingValidatorService,
    propertiesIndexerService: PropertiesIndexerService,
  ) {
    void mappingValidatorService
      .initIndex(this.index, this.getMapping())
      .then((mappingWasUpdated) => {
        if (mappingWasUpdated) {
          return propertiesIndexerService.indexAllProperties()
        }
      })
  }

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
  })
}
