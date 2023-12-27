import { EventIndex } from '@modules/definitions';
import { INDEX_EVENTS } from '@modules/search/constants';
import { MappingValidatorService } from '@modules/search/services/mapping/mappingValidatorService';
import { MappingInterface } from './mapping';
import { MappingHelperService } from './mappingHelperService';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class EventsMappingService
  implements MappingInterface<EventIndex>, OnApplicationBootstrap
{
  constructor(
    private readonly mappingHelperService: MappingHelperService,
    private readonly mappingValidatorService: MappingValidatorService,
  ) {}

  getMapping = (): Record<keyof EventIndex, MappingProperty> => ({
    type: this.mappingHelperService.keywordField,
    date: this.mappingHelperService.dateTime,
    location: this.mappingHelperService.textField,
    description: this.mappingHelperService.romanianTextProperty,
    persons: this.mappingHelperService.connectedPerson,
    companies: this.mappingHelperService.connectedCompany,
    properties: this.mappingHelperService.connectedProperty,
    files: this.mappingHelperService.files,
    customFields: this.mappingHelperService.customFields,
  });

  async onApplicationBootstrap() {
    await this.mappingValidatorService.initIndex(
      INDEX_EVENTS,
      this.getMapping(),
    );
  }
}
