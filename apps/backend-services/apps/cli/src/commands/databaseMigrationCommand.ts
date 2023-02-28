import { Command, CommandRunner } from 'nest-commander'

@Command({
  name: 'db-upgrade',
  description: 'Updates the structure of the documents in defined collections.',
})
export class DatabaseMigrationCommand extends CommandRunner {
  async run(inputs: string[], options: Record<string, never>) {
    return Promise.reject('Not implemented yet.')
  }
}
