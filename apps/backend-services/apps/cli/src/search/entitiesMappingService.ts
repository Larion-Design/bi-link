import {
  INDEX_COMPANIES,
  INDEX_EVENTS,
  INDEX_PERSONS,
  INDEX_PROPERTIES,
} from '@app/definitions/constants'
import {
  CompaniesMappingService,
  EventsMappingService,
  MappingValidatorService,
  PersonsMappingService,
  PropertiesMappingService,
} from '@app/search-tools-module/mapping'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EntitiesMappingService {
  constructor(
    private readonly personsMappingService: PersonsMappingService,
    private readonly companiesMappingService: CompaniesMappingService,
    private readonly propertiesMappingService: PropertiesMappingService,
    private readonly eventsMappingService: EventsMappingService,
    private readonly mappingValidatorService: MappingValidatorService,
  ) {}

  updatePersonsMapping = async () =>
    this.mappingValidatorService.initIndex(INDEX_PERSONS, this.personsMappingService.getMapping())

  updateCompaniesMapping = async () =>
    this.mappingValidatorService.initIndex(
      INDEX_COMPANIES,
      this.companiesMappingService.getMapping(),
    )

  updatePropertiesMapping = async () =>
    this.mappingValidatorService.initIndex(
      INDEX_PROPERTIES,
      this.propertiesMappingService.getMapping(),
    )

  updateEventsMapping = async () =>
    this.mappingValidatorService.initIndex(INDEX_EVENTS, this.eventsMappingService.getMapping())
}
