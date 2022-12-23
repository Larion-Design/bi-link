import { Command, CommandRunner } from 'nest-commander'

@Command({
  name: 'graph-upgrade',
  arguments: '<entity>',
  description: 'Updates the nodes of a given type in the graph.',
})
export class GraphMigrationCommand extends CommandRunner {
  async run(inputs: string[], options: Record<string, never>) {
    return Promise.resolve()
  }
}
