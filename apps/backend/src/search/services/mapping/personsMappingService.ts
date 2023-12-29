import { PersonIndex } from '@modules/definitions'
import { INDEX_PERSONS } from '@modules/search/constants'
import { MappingValidatorService } from '@modules/search/services/mapping/mappingValidatorService'
import { MappingInterface } from './mapping'
import { MappingHelperService } from './mappingHelperService'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class PersonsMappingService
  implements MappingInterface<PersonIndex>, OnApplicationBootstrap
{
  constructor(
    private readonly mappingHelperService: MappingHelperService,
    private readonly mappingValidatorService: MappingValidatorService,
  ) {}

  getMapping = (): Record<keyof PersonIndex, MappingProperty> => ({
    cnp: this.mappingHelperService.keywordField,
    firstName: this.mappingHelperService.textField,
    lastName: this.mappingHelperService.textField,
    oldNames: {
      type: 'nested',
      properties: {
        name: this.mappingHelperService.textField,
        changeReason: this.mappingHelperService.textField,
      },
    },
    birthPlace: this.mappingHelperService.location,
    homeAddress: this.mappingHelperService.location,
    documents: {
      type: 'nested',
      properties: {
        documentNumber: this.mappingHelperService.keywordField,
        status: this.mappingHelperService.keywordField,
        validity: this.mappingHelperService.dateRange,
      },
    },
    birthdate: this.mappingHelperService.date,
    files: this.mappingHelperService.files,
    contactDetails: this.mappingHelperService.customFields,
    customFields: this.mappingHelperService.customFields,
    education: {
      type: 'nested',
      properties: {
        type: this.mappingHelperService.keywordField,
        school: this.mappingHelperService.textField,
        specialization: this.mappingHelperService.textField,
        customFields: this.mappingHelperService.customFields,
        period: this.mappingHelperService.yearRange,
      },
    },
  })

  async onApplicationBootstrap() {
    await this.mappingValidatorService.initIndex(INDEX_PERSONS, this.getMapping())
  }
}
