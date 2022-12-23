import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { MappingValidatorService } from '@app/search-mapping-tools/services/mapping/mappingValidatorService'
import { ProcessedFileIndex } from '@app/definitions/file'
import { INDEX_FILES } from '@app/definitions/constants'
import { FilesIndexerService } from './filesIndexerService'
import { MappingHelperService } from '@app/search-mapping-tools/services/mapping/mappingHelperService'
import { MappingInterface } from '@app/search-mapping-tools'

@Injectable()
export class FilesMappingService implements MappingInterface<ProcessedFileIndex> {
  private readonly index = INDEX_FILES

  constructor(
    private readonly mappingHelperService: MappingHelperService,
    mappingValidatorService: MappingValidatorService,
    filesIndexerService: FilesIndexerService,
  ) {
    void mappingValidatorService
      .initIndex(this.index, this.getMapping())
      .then((mappingHasChanged) => {
        if (mappingHasChanged) {
          return filesIndexerService.indexAllFiles()
        }
      })
  }

  getMapping = (): Record<keyof ProcessedFileIndex, MappingProperty> => ({
    content: this.mappingHelperService.romanianTextProperty,
    processedDate: this.mappingHelperService.dateTime,
  })
}
