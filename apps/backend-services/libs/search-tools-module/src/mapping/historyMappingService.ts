import { MappingHelperService, MappingInterface } from '@app/search-tools-module/mapping/index'
import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { ActivityEventIndex } from 'defs'

@Injectable()
export class HistoryMappingService implements MappingInterface<ActivityEventIndex> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

  getMapping = (): Record<keyof ActivityEventIndex, MappingProperty> => ({
    timestamp: this.mappingHelperService.timestamp,
    eventType: this.mappingHelperService.keywordField,
    author: this.mappingHelperService.keywordField,
    target: this.mappingHelperService.keywordField,
    targetType: this.mappingHelperService.keywordField,
  })
}
