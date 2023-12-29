import { INDEX_PROCEEDINGS } from '@modules/search/constants'
import { MappingValidatorService } from '@modules/search/services/mapping/mappingValidatorService'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ProceedingIndex } from '@modules/definitions'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { MappingInterface } from './mapping'
import { MappingHelperService } from './mappingHelperService'

@Injectable()
export class ProceedingsMappingService
  implements MappingInterface<ProceedingIndex>, OnApplicationBootstrap
{
  constructor(
    private readonly mappingHelperService: MappingHelperService,
    private readonly mappingValidatorService: MappingValidatorService,
  ) {}

  getMapping = (): Record<keyof ProceedingIndex, MappingProperty> => ({
    name: this.mappingHelperService.textField,
    type: this.mappingHelperService.keywordField,
    year: this.mappingHelperService.year,
    fileNumber: this.mappingHelperService.keywordField,
    status: this.mappingHelperService.keywordField,
    description: this.mappingHelperService.romanianTextProperty,
    persons: this.mappingHelperService.connectedPerson,
    companies: this.mappingHelperService.connectedCompany,
    customFields: this.mappingHelperService.customFields,
    files: this.mappingHelperService.files,
  })

  async onApplicationBootstrap() {
    await this.mappingValidatorService.initIndex(INDEX_PROCEEDINGS, this.getMapping())
  }
}
