import { EventIndex, PartyIndex } from '@app/definitions/search/event'
import { MappingInterface } from './mapping'
import { MappingHelperService } from './mappingHelperService'
import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class EventsMappingService implements MappingInterface<EventIndex> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

  getMapping = (): Record<string | keyof EventIndex, MappingProperty> => ({
    type: this.mappingHelperService.keywordField,
    date: this.mappingHelperService.dateTime,
    location: this.mappingHelperService.textField,
    description: this.mappingHelperService.romanianTextProperty,
    parties: {
      type: 'nested',
      properties: {
        name: this.mappingHelperService.keywordField,
        description: this.mappingHelperService.romanianTextProperty,
        customFields: this.mappingHelperService.customFields,
      } as Record<string | keyof PartyIndex, MappingProperty>,
    },
    persons: this.mappingHelperService.connectedPerson,
    companies: this.mappingHelperService.connectedCompany,
    properties: this.mappingHelperService.connectedProperty,
    files: this.mappingHelperService.files,
    customFields: this.mappingHelperService.customFields,
  })
}
