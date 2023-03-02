import { ProcessedFileIndex } from '@app/definitions/search/file'
import { MappingInterface } from './mapping'
import { MappingHelperService } from './mappingHelperService'
import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class FilesMappingService implements MappingInterface<ProcessedFileIndex> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

  getMapping = (): Record<keyof ProcessedFileIndex, MappingProperty> => ({
    content: this.mappingHelperService.romanianTextProperty,
    processedDate: this.mappingHelperService.dateTime,
  })
}
