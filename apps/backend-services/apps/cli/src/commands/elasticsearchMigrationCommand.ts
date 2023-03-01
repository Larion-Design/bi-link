import { Logger } from '@nestjs/common'
import { Command, CommandRunner, Option } from 'nest-commander'
import { EntitiesMappingService } from '../search/entitiesMappingService'

type CommandOptions = {
  entity: 'persons' | 'companies' | 'properties' | 'events'
}

@Command({
  name: 'search-mapping',
  arguments: '<type>',
  description:
    'Updates mapping for the specified entity type (persons | companies | properties | events).',
})
export class ElasticsearchMigrationCommand extends CommandRunner {
  private readonly logger = new Logger(ElasticsearchMigrationCommand.name)

  constructor(private readonly entitiesMappingService: EntitiesMappingService) {
    super()
  }

  async run(passedParam: string[], options?: CommandOptions) {
    switch (options?.entity) {
      case 'persons': {
        await this.entitiesMappingService.updatePersonsMapping()
        return
      }
      case 'companies': {
        await this.entitiesMappingService.updateCompaniesMapping()
        return
      }
      case 'properties': {
        await this.entitiesMappingService.updatePropertiesMapping()
        return
      }
      case 'events': {
        await this.entitiesMappingService.updateEventsMapping()
        return
      }
    }
    return Promise.reject(
      `Entity type is invalid or not specified (value provided: ${options?.entity})`,
    )
  }

  @Option({
    flags: '-t, --type [persons | companies | properties | events]',
    description: 'Mapping for this entity type will be updated.',
  })
  parseType(value: string) {
    return value.trim().toLowerCase()
  }
}
