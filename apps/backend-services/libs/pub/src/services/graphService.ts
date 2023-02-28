import { Inject, Injectable, Logger } from '@nestjs/common'
import { EntityInfo, MICROSERVICES } from '@app/pub/constants'
import { ClientProxy } from '@nestjs/microservices'
import { EntityType } from 'defs'

@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name)

  constructor(@Inject(MICROSERVICES.GRAPH.id) private client: ClientProxy) {}

  emitEntityModified(entityEventInfo: EntityInfo) {
    try {
      this.client.emit(MICROSERVICES.GRAPH.entityModified, entityEventInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  emitEntityCreated(entityEventInfo: EntityInfo) {
    try {
      this.client.emit(MICROSERVICES.GRAPH.entityCreated, entityEventInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  emitEntitiesRefresh(entityType: EntityType) {
    try {
      this.client.emit(MICROSERVICES.GRAPH.entitiesRefresh, entityType)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
