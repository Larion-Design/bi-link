import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { EntityType } from 'defs'
import { MICROSERVICES } from '@app/rpc'
import { GraphServiceMethods } from '@app/rpc/microservices/graph/graphServiceConfig'

@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name)

  constructor(@Inject(MICROSERVICES.GRAPH.id) private client: ClientProxy) {}

  getEntityRelationships = async (entityId: string, depth: number) => {
    type Params = Parameters<GraphServiceMethods['getEntityRelationships']>[0]
    type Result = ReturnType<GraphServiceMethods['getEntityRelationships']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.GRAPH.getEntityRelationships, {
            entityId,
            depth,
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
      this.logger.debug(
        'No valid response received from the ingress service. Make sure the service is running properly.',
      )
    }
  }

  refreshNodes = async (entityType: EntityType) => {
    try {
      type Params = Parameters<GraphServiceMethods['refreshNodes']>[0]
      type Result = ReturnType<GraphServiceMethods['refreshNodes']>

      this.client.emit<Result, Params>(MICROSERVICES.GRAPH.refreshNodes, entityType)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
