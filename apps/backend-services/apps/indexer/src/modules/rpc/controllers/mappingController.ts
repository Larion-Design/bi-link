import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/rpc'
import { IndexerServiceMethods } from '@app/rpc/microservices/indexer/indexerServiceConfig'
import {
  INDEX_COMPANIES,
  INDEX_EVENTS,
  INDEX_FILES,
  INDEX_HISTORY,
  INDEX_PERSONS,
  INDEX_PROCEEDINGS,
  INDEX_PROPERTIES,
} from '../../../constants'
import {
  CompaniesMappingService,
  EventsMappingService,
  FilesMappingService,
  HistoryMappingService,
  MappingValidatorService,
  PersonsMappingService,
  ProceedingsMappingService,
  PropertiesMappingService,
} from '../../mapping/services'

@Controller()
export class MappingController {
  constructor(
    private readonly personsMappingService: PersonsMappingService,
    private readonly companiesMappingService: CompaniesMappingService,
    private readonly propertiesMappingService: PropertiesMappingService,
    private readonly eventsMappingService: EventsMappingService,
    private readonly filesMappingService: FilesMappingService,
    private readonly proceedingsMappingService: ProceedingsMappingService,
    private readonly historyMappingService: HistoryMappingService,
    private readonly mappingValidatorService: MappingValidatorService,
  ) {}

  @EventPattern(MICROSERVICES.INDEXER.createMapping)
  async createMapping(
    @Payload() entityOrIndex: Parameters<IndexerServiceMethods['createMapping']>[0],
  ) {
    switch (entityOrIndex) {
      case 'PERSON': {
        return this.mappingValidatorService.initIndex(
          INDEX_PERSONS,
          this.personsMappingService.getMapping(),
        )
      }
      case 'COMPANY': {
        return this.mappingValidatorService.initIndex(
          INDEX_COMPANIES,
          this.companiesMappingService.getMapping(),
        )
      }
      case 'EVENT': {
        return this.mappingValidatorService.initIndex(
          INDEX_EVENTS,
          this.eventsMappingService.getMapping(),
        )
      }
      case 'PROPERTY': {
        return this.mappingValidatorService.initIndex(
          INDEX_PROPERTIES,
          this.propertiesMappingService.getMapping(),
        )
      }
      case 'FILE': {
        return this.mappingValidatorService.initIndex(
          INDEX_FILES,
          this.filesMappingService.getMapping(),
        )
      }
      case 'PROCEEDING': {
        return this.mappingValidatorService.initIndex(
          INDEX_PROCEEDINGS,
          this.proceedingsMappingService.getMapping(),
        )
      }
      case 'ACTIVITY_EVENT': {
        return this.mappingValidatorService.initIndex(
          INDEX_HISTORY,
          this.historyMappingService.getMapping(),
        )
      }
    }
  }
}
