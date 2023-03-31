import { ActivityEventIndex } from '@app/definitions/indexer/activityEvent'
import { MICROSERVICES } from '@app/rpc'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { EntityInfo, EntityType } from 'defs'
import { IndexerServiceMethods } from '@app/rpc/microservices/indexer/indexerServiceConfig'

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name)

  constructor(@Inject(MICROSERVICES.INDEXER.id) private client: ClientProxy) {}

  search = async (searchTerm: string, entityTypes: EntityType[], limit: number, skip: number) => {
    type Params = Parameters<IndexerServiceMethods['search']>[0]
    type Result = ReturnType<IndexerServiceMethods['search']>

    try {
      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.INDEXER.search, {
            searchTerm,
            entityTypes,
            limit,
            skip,
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

  indexEntity(entityEventInfo: EntityInfo) {
    try {
      this.client.emit(MICROSERVICES.INDEXER.indexEntity, entityEventInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  reindexEntities(entityType: EntityType) {
    try {
      this.client.emit(MICROSERVICES.INDEXER.reindexEntities, entityType)
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
