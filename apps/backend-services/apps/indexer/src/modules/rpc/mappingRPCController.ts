import { EntityInfo, MICROSERVICES } from '@app/rpc'
import { Controller } from '@nestjs/common'
import {
  INDEX_COMPANIES,
  INDEX_EVENTS,
  INDEX_FILES,
  INDEX_PERSONS,
  INDEX_PROPERTIES,
} from '@app/definitions'
import {
  CompaniesMappingService,
  EventsMappingService,
  FilesMappingService,
  MappingValidatorService,
  PersonsMappingService,
  PropertiesMappingService,
} from '../mapping/services'
import { EventPattern, Payload } from '@nestjs/microservices'
import { EntityType } from 'defs'

@Controller()
export class MappingRPCController {
  constructor(
    private readonly personsMappingService: PersonsMappingService,
    private readonly companiesMappingService: CompaniesMappingService,
    private readonly propertiesMappingService: PropertiesMappingService,
    private readonly eventsMappingService: EventsMappingService,
    private readonly filesMappingService: FilesMappingService,
    private readonly mappingValidatorService: MappingValidatorService,
  ) {}

  @EventPattern(MICROSERVICES.INDEXER.createMapping)
  async createMapping(@Payload() entityType: EntityType) {
    switch (entityType) {
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
    }
  }
}
