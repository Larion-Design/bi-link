import { Injectable } from '@nestjs/common'
import { ProceedingIndex } from '@app/definitions'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { MappingInterface } from './mapping'
import { MappingHelperService } from './mappingHelperService'

@Injectable()
export class ProceedingsMappingService implements MappingInterface<ProceedingIndex> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

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
}
