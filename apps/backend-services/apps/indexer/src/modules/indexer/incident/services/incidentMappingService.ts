import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { INDEX_INCIDENTS } from '@app/definitions/constants'
import { IncidentsIndexerService } from './incidentsIndexerService'
import { MappingHelperService } from '@app/search-mapping-tools/services/mapping/mappingHelperService'
import { MappingValidatorService } from '@app/search-mapping-tools/services/mapping/mappingValidatorService'
import { IncidentIndex } from '@app/definitions/incident'
import { PartyIndex } from '@app/definitions/party'
import { MappingInterface } from '@app/search-mapping-tools'

@Injectable()
export class IncidentMappingService implements MappingInterface<IncidentIndex> {
  private readonly index = INDEX_INCIDENTS

  constructor(
    private readonly mappingHelperService: MappingHelperService,
    mappingValidatorService: MappingValidatorService,
    incidentsIndexerService: IncidentsIndexerService,
  ) {
    void mappingValidatorService
      .initIndex(this.index, this.getMapping())
      .then((mappingWasUpdated) => {
        if (mappingWasUpdated) {
          return incidentsIndexerService.indexAllIncidents()
        }
      })
  }

  getMapping = (): Record<string | keyof IncidentIndex, MappingProperty> => ({
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
