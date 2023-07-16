import { EntityEventInfo, EVENT_CREATED, EVENT_UPDATED } from '@app/scheduler-module'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class EntityEventSchedulerService {
  protected readonly logger = new Logger(EntityEventSchedulerService.name)
  protected readonly queue: Queue<EntityEventInfo>

  async dispatchEntityCreated(entityId: string) {
    return this.publishJob(EVENT_CREATED, { entityId })
  }

  async dispatchEntityUpdated(entityId: string) {
    return this.publishJob(EVENT_UPDATED, { entityId })
  }

  async dispatchEntitiesUpdated(entitiesIds: string[]) {
    return this.queue.addBulk(
      entitiesIds.map((entityId) => ({ name: EVENT_UPDATED, data: { entityId } })),
    )
  }

  protected async publishJob(eventType: string, eventInfo: EntityEventInfo) {
    try {
      return this.queue.add(eventType, eventInfo)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
