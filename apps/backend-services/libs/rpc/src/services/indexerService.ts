import { Inject, Injectable, Logger } from '@nestjs/common'
import { EntityInfo, MICROSERVICES } from '@app/rpc/constants'
import { ClientProxy } from '@nestjs/microservices'
import { ActivityEventIndex, EntityType } from 'defs'

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name)

  constructor(@Inject(MICROSERVICES.INDEXER.id) private client: ClientProxy) {}

  indexEntity(entityEventInfo: EntityInfo) {
    try {
      this.client.emit(MICROSERVICES.INDEXER.indexEntity, entityEventInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  entitiesRefresh(entityType: EntityType) {
    try {
      this.client.emit(MICROSERVICES.INDEXER.entitiesRefresh, entityType)
    } catch (e) {
      this.logger.error(e)
    }
  }

  createMapping(entityType: EntityType) {
    try {
      this.client.emit(MICROSERVICES.INDEXER.createMapping, entityType)
    } catch (e) {
      this.logger.error(e)
    }
  }

  recordHistoryEvent(activityEvent: ActivityEventIndex) {
    try {
      this.client.emit(MICROSERVICES.INDEXER.recordHistoryEvent, activityEvent)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
