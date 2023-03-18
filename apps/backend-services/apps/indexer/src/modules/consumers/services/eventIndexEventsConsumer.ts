import {
  EVENT_CREATED,
  EventEventInfo,
  EVENT_UPDATED,
  FileParentEntity,
} from '@app/scheduler-module'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { Job } from 'bull'
import { EventsService } from '@app/models/services/eventsService'
import { EventsIndexerService } from '../../indexer/services'
import { QUEUE_EVENTS } from '../../producers/constants'

@Processor(QUEUE_EVENTS)
export class EventIndexEventsConsumer {
  private readonly logger = new Logger(EventIndexEventsConsumer.name)

  constructor(
    private readonly eventsService: EventsService,
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
  async eventCreated(job: Job<EventEventInfo>) {
    const {
      data: { eventId },
    } = job

    try {
      if (await this.indexEventInfo(eventId)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async eventUpdated(job: Job<EventEventInfo>) {
    const {
      data: { eventId },
    } = job

    try {
      if (await this.indexEventInfo(eventId)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  private indexEventInfo = async (eventId: string) => {
    const event = await this.eventsService.getEvent(eventId, true)
    const indexingSuccessful = await this.eventsIndexerService.indexEvent(eventId, event)

    if (indexingSuccessful) {
      const filesIds = event.files.map(({ fileId }) => fileId)

      if (filesIds.length) {
        await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, {
          type: FileParentEntity.EVENT,
          id: eventId,
        })
      }
      return true
    }
  }
}
