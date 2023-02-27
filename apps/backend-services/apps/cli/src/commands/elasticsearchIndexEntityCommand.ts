import { Logger } from '@nestjs/common'
import { Command, CommandRunner, Option } from 'nest-commander'
import { EntitiesIndexerService } from '../search/entitiesIndexerService'

type CommandOptions = {
  entity: 'persons' | 'companies' | 'properties' | 'events'
}

@Command({
  name: 'search-index',
  arguments: '<entity>',
  description:
    'Regenerates index for the specified entity type (persons | companies | properties | events)',
})
export class ElasticsearchIndexEntityCommand extends CommandRunner {
  private readonly logger = new Logger(ElasticsearchIndexEntityCommand.name)

  constructor(private readonly entitiesIndexerService: EntitiesIndexerService) {
    super()
  }
  async run(inputs: string[], options?: CommandOptions) {
    const { entity } = options

    switch (entity) {
      case 'persons': {
        await this.entitiesIndexerService.indexAllPersons()
        return
      }
      case 'companies': {
        await this.entitiesIndexerService.indexAllCompanies()
        return
      }
      case 'properties': {
        await this.entitiesIndexerService.indexAllProperties()
        return
      }
      case 'events': {
        await this.entitiesIndexerService.indexAllEvents()
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
