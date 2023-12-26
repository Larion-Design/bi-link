import { EventIndex } from '@modules/definitions';
import { MappingInterface } from './mapping';
import { MappingHelperService } from './mappingHelperService';
import { Injectable } from '@nestjs/common';
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class EventsMappingService implements MappingInterface<EventIndex> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

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
}
