import { ActivityEventIndex } from '@app/definitions/indexer/activityEvent'
import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { ActivityEvent } from 'defs'
import { MappingHelperService, MappingInterface } from './index'

@Injectable()
export class HistoryMappingService implements MappingInterface<ActivityEvent> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

  getMapping = (): Record<keyof ActivityEventIndex, MappingProperty> => ({
    timestamp: this.mappingHelperService.timestamp,
    eventType: this.mappingHelperService.keywordField,
    targetEntityInfo: {
      type: 'nested',
      properties: {
        entityId: this.mappingHelperService.keywordField,
        entityType: this.mappingHelperService.keywordField,
      },
    },
    author: {
      type: 'nested',
      properties: {
        type: this.mappingHelperService.keywordField,
        sourceId: this.mappingHelperService.keywordField,
      },
    },
  })
}
