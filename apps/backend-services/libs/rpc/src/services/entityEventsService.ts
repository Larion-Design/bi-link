import { Inject, Injectable, Logger } from '@nestjs/common'
import { MICROSERVICES } from '@app/rpc/constants'
import { ClientProxy } from '@nestjs/microservices'
import { EntityInfo, EntityType } from 'defs'

@Injectable()
export class EntityEventsService {
  private readonly logger = new Logger(EntityEventsService.name)

  constructor(@Inject(MICROSERVICES.ENTITY_EVENTS.id) private client: ClientProxy) {}

  emitEntityModified(entityEventInfo: EntityInfo) {
    try {
      this.client.emit(MICROSERVICES.ENTITY_EVENTS.entityModified, entityEventInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  emitEntityCreated(entityEventInfo: EntityInfo) {
    try {
      this.client.emit(MICROSERVICES.ENTITY_EVENTS.entityCreated, entityEventInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  emitEntitiesRefresh(entityType: EntityType) {
    try {
      this.client.emit(MICROSERVICES.ENTITY_EVENTS.entitiesRefresh, entityType)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
