import { Command, CommandRunner } from 'nest-commander'

@Command({
  name: 'search-index',
  arguments: '<entity>',
  description:
    'Regenerates index for the specified entity type (persons | companies | properties | events)..',
})
export class ElasticsearchIndexEntityCommand extends CommandRunner {
  async run(inputs: string[], options: Record<string, never>) {
    return Promise.resolve()
  }
}
