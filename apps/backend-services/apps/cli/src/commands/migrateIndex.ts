import { IndexerService } from '@app/rpc'
import { Logger } from '@nestjs/common'
import { EntityType } from 'defs'
import { Command, CommandRunner, Option } from 'nest-commander'

type CommandOptions = {
  type: EntityType
}

@Command({
  name: 'search-mapping',
  arguments: '<type>',
  description:
    'Updates mapping for the specified entity type (persons | companies | properties | events).',
})
export class MigrateIndex extends CommandRunner {
  private readonly logger = new Logger(MigrateIndex.name)

  constructor(private readonly indexerService: IndexerService) {
    super()
  }

  async run(passedParam: string[], options?: CommandOptions) {
    if (options?.type) {
      this.indexerService.createMapping(options?.type)
    } else return Promise.reject('Entity type invalid or not specified.')
  }

  @Option({
    flags: '-t, --type [person | company | property | event]',
    description: 'Mapping for this entity type will be updated.',
  })
  parseType(value: string) {
    return value.trim().toUpperCase()
  }
}
