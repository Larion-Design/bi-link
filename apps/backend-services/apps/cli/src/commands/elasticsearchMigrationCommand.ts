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
import { Command, CommandRunner, Option } from 'nest-commander'

type CommandOptions = {
  type: 'persons' | 'companies' | 'properties' | 'events'
}

@Command({
  name: 'search-mapping',
  arguments: '<entity>',
  description:
    'Updates mapping for the specified entity type (persons | companies | properties | events).',
})
export class ElasticsearchMigrationCommand extends CommandRunner {
  constructor(
    private readonly mappingValidatorService: MappingValidatorService,
    private readonly personsMappingService: PersonsMappingService,
    private readonly companiesMappingService: CompaniesMappingService,
    private readonly propertiesMappingService: PropertiesMappingService,
    private readonly eventsMappingService: EventsMappingService,
  ) {
    super()
  }

  async run(passedParam: string[], options?: CommandOptions) {
    switch (options?.type) {
      case 'persons': {
        await this.mappingValidatorService.initIndex(
          INDEX_PERSONS,
          this.personsMappingService.getMapping(),
        )
        break
      }
      case 'companies': {
        await this.mappingValidatorService.initIndex(
          INDEX_COMPANIES,
          this.companiesMappingService.getMapping(),
        )
        break
      }
      case 'properties': {
        await this.mappingValidatorService.initIndex(
          INDEX_PROPERTIES,
          this.propertiesMappingService.getMapping(),
        )
        break
      }
      case 'events': {
        await this.mappingValidatorService.initIndex(
          INDEX_EVENTS,
          this.eventsMappingService.getMapping(),
        )
        break
      }
    }
    return Promise.resolve()
  }

  @Option({
    flags: '-t, --type [persons | companies | properties | events]',
    description: 'Mapping for this entity type will be updated.',
  })
  parseType(value: string) {
    return value.trim().toLowerCase()
  }
}
