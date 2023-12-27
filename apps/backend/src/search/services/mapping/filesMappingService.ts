import { ProcessedFileIndex } from '@modules/definitions';
import { INDEX_FILES } from '@modules/search/constants';
import { MappingValidatorService } from '@modules/search/services/mapping/mappingValidatorService';
import { MappingInterface } from './mapping';
import { MappingHelperService } from './mappingHelperService';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class FilesMappingService
  implements MappingInterface<ProcessedFileIndex>, OnApplicationBootstrap
{
  constructor(
    private readonly mappingHelperService: MappingHelperService,
    private readonly mappingValidatorService: MappingValidatorService,
  ) {}

  getMapping = (): Record<keyof ProcessedFileIndex, MappingProperty> => ({
    content: this.mappingHelperService.romanianTextProperty,
    processedDate: this.mappingHelperService.dateTime,
  });

  async onApplicationBootstrap() {
    await this.mappingValidatorService.initIndex(
      INDEX_FILES,
      this.getMapping(),
    );
  }
}
