import { GraphService } from '@app/pub/services/graphService'
import { Command, CommandRunner, Option } from 'nest-commander'

type CommandOptions = {
  type: 'persons' | 'companies' | 'properties' | 'events'
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
    const { type } = options

    switch (type) {
      case 'persons': {
        return this.graphService.emitEntitiesRefresh('PERSON')
      }
      case 'companies': {
        return this.graphService.emitEntitiesRefresh('COMPANY')
      }
      case 'properties': {
        return this.graphService.emitEntitiesRefresh('PROPERTY')
      }
      case 'events': {
        return this.graphService.emitEntitiesRefresh('EVENT')
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
