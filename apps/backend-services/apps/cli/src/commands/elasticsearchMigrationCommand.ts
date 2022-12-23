import { Command, CommandRunner } from 'nest-commander'

@Command({
  name: 'search-upgrade',
  arguments: '<entity>',
  description: 'Updates index mapping for the specified entity.',
})
export class ElasticsearchMigrationCommand extends CommandRunner {
  async run(inputs: string[], options: Record<string, never>) {
    return Promise.resolve()
  }
}
