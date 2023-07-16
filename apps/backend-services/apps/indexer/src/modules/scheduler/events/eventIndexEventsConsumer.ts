import { IngressService } from '@app/rpc/microservices/ingress'
import { EVENT_CREATED, EVENT_UPDATED, EntityEventInfo } from '@app/scheduler-module'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { EntityInfo, Event } from 'defs'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'
import { Job } from 'bull'
import { EventsIndexerService } from '../../indexer/services'
import { AUTHOR, QUEUE_EVENTS } from '../../constants'

@Processor(QUEUE_EVENTS)
export class EventIndexEventsConsumer {
  private readonly logger = new Logger(EventIndexEventsConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly eventsIndexerService: EventsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {}

  @OnQueueActive()
  onQueueActive({ id, name }: Job) {
    this.logger.debug(`Processing job ID ${id} (${name})`)
  }

  @OnQueueCompleted()
  onQueueCompleted({ id, name }: Job) {
    this.logger.debug(`Completed job ID ${id} (${name})`)
  }

  @OnQueueFailed()
  onQueueFailed({ id, name }: Job) {
    this.logger.debug(`Failed job ID ${id} (${name})`)
  }

  @Process(EVENT_CREATED)
  async eventCreated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      if (await this.indexEventInfo(entityId)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async eventUpdated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      if (await this.indexEventInfo(entityId)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
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
