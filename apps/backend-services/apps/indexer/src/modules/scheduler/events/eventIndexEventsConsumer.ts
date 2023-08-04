import { IngressService } from '@app/rpc/microservices/ingress'
import { EntityEventInfo } from '@app/scheduler-module'
import { WorkerHost, Processor } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { EntityInfo, Event } from 'defs'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'
import { Job } from 'bullmq'
import { EventsIndexerService } from '../../indexer/services'
import { AUTHOR, QUEUE_EVENTS } from '../../constants'

@Processor(QUEUE_EVENTS)
export class EventIndexEventsConsumer extends WorkerHost {
  private readonly logger = new Logger(EventIndexEventsConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly eventsIndexerService: EventsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    const {
      data: { entityId },
    } = job

    await this.indexEventInfo(entityId)
  }

  private async indexEventInfo(entityId: string) {
    const entityInfo: EntityInfo = { entityId, entityType: 'EVENT' }
    const event = (await this.ingressService.getEntity(entityInfo, true, AUTHOR)) as Event

    if (event) {
      const indexingSuccessful = await this.eventsIndexerService.indexEvent(entityId, event)

      if (indexingSuccessful) {
        const filesIds = event.files.map(({ fileId }) => fileId)

        if (filesIds.length) {
          await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, entityInfo)
        }
        return true
      }
    }
  }
}
