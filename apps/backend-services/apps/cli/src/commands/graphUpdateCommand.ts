import { GraphService } from '@app/rpc/microservices/graph/graphService'
import { Command, CommandRunner, Option } from 'nest-commander'

type CommandOptions = {
  type: 'persons' | 'companies' | 'properties' | 'events' | 'proceedings'
}

@Command({
  name: 'graph-update',
  arguments: '<type>',
  description:
    'Updates graph for the specified entity type (persons | companies | properties | events)',
})
export class GraphUpdateCommand extends CommandRunner {
  constructor(private readonly graphService: GraphService) {
    super()
  }

  async run(inputs: string[], options?: CommandOptions) {
    if (options?.type) {
      const { type } = options

      switch (type) {
        case 'persons': {
          return this.graphService.refreshNodes('PERSON')
        }
        case 'companies': {
          return this.graphService.refreshNodes('COMPANY')
        }
        case 'properties': {
          return this.graphService.refreshNodes('PROPERTY')
        }
        case 'proceedings': {
          return this.graphService.refreshNodes('PROCEEDING')
        }
        case 'events': {
          return this.graphService.refreshNodes('EVENT')
        }
      }
    }
    return Promise.reject(
      `Entity type is invalid or not specified (value provided: ${options?.type})`,
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
