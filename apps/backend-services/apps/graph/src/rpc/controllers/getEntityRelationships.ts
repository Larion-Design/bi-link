import { MICROSERVICES } from '@app/rpc'
import { GraphServiceMethods } from '@app/rpc/microservices/graph/graphServiceConfig'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { GraphService } from '../../graph'

type Params = Parameters<GraphServiceMethods['getEntityRelationships']>[0]
type Result = ReturnType<GraphServiceMethods['getEntityRelationships']>

@Controller()
export class GetEntityRelationships {
  constructor(private readonly graphService: GraphService) {}

  @MessagePattern(MICROSERVICES.GRAPH.getEntityRelationships)
  async getEntityRelationships(@Payload() { entityId, depth }: Params): Promise<Result> {
    return this.graphService.getEntitiesGraph(entityId, depth)
  }
}
