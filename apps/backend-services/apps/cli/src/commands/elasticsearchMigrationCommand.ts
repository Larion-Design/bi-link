import { Command, CommandRunner } from 'nest-commander'

@Command({
  name: 'search-mapping',
  arguments: '<entity>',
  description:
    'Updates mapping for the specified entity type (persons | companies | properties | events).',
})
export class ElasticsearchMigrationCommand extends CommandRunner {
  async run(inputs: string[], options: Record<string, never>) {
    return Promise.resolve()
  }
}
