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
} from '@app/definitions'
import {
  CompaniesMappingService,
  EventsMappingService,
  FilesMappingService,
  HistoryMappingService,
  MappingValidatorService,
  PersonsMappingService,
  ProceedingsMappingService,
  PropertiesMappingService,
} from '../mapping/services'

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
        await this.mappingValidatorService.initIndex(
          INDEX_PERSONS,
          this.personsMappingService.getMapping(),
        )
        break
      }
      case 'COMPANY': {
        await this.mappingValidatorService.initIndex(
          INDEX_COMPANIES,
          this.companiesMappingService.getMapping(),
        )
        break
      }
      case 'EVENT': {
        await this.mappingValidatorService.initIndex(
          INDEX_EVENTS,
          this.eventsMappingService.getMapping(),
        )
        break
      }
      case 'PROPERTY': {
        await this.mappingValidatorService.initIndex(
          INDEX_PROPERTIES,
          this.propertiesMappingService.getMapping(),
        )
        break
      }
      case 'FILE': {
        await this.mappingValidatorService.initIndex(
          INDEX_FILES,
          this.filesMappingService.getMapping(),
        )
        break
      }
      case 'PROCEEDING': {
        await this.mappingValidatorService.initIndex(
          INDEX_PROCEEDINGS,
          this.proceedingsMappingService.getMapping(),
        )
        break
      }
      case 'ACTIVITY_EVENT': {
        await this.mappingValidatorService.initIndex(
          INDEX_HISTORY,
          this.historyMappingService.getMapping(),
        )
        break
      }
    }
  }
}
