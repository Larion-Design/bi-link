import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { MappingValidatorService } from '@app/search-mapping-tools/services/mapping/mappingValidatorService'
import { INDEX_HISTORY } from '@app/definitions/constants'
import { ActivityEventIndex } from '@app/definitions/activityEvent'
import { MappingHelperService } from '@app/search-mapping-tools/services/mapping/mappingHelperService'
import { MappingInterface } from '@app/search-mapping-tools'

@Injectable()
export class HistoryMappingService implements MappingInterface<ActivityEventIndex> {
  private readonly index = INDEX_HISTORY

  constructor(
    private readonly mappingHelperService: MappingHelperService,
    mappingValidatorService: MappingValidatorService,
  ) {
    void mappingValidatorService.initIndex(this.index, this.getMapping())
  }

  getMapping = (): Record<keyof ActivityEventIndex, MappingProperty> => ({
    timestamp: this.mappingHelperService.timestamp,
    eventType: this.mappingHelperService.keywordField,
    author: this.mappingHelperService.keywordField,
    target: this.mappingHelperService.keywordField,
    targetType: this.mappingHelperService.keywordField,
  })
}
