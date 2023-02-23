import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { Job } from 'bull'
import { EventsService } from '@app/entities/services/eventsService'
import { EventsIndexerService } from '@app/search-tools-module/indexer/eventsIndexerService'
import { EventEventInfo } from '@app/pub/types/event'
import { FileParentEntity } from '@app/pub/types/file'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_EVENTS } from '../../producers/constants'

@Processor(QUEUE_EVENTS)
export class EventIndexEventsConsumer {
  private readonly logger = new Logger(EventIndexEventsConsumer.name)

  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsIndexerService: EventsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {}

  @Process(EVENT_CREATED)
  async eventCreated(job: Job<EventEventInfo>) {
    const {
      data: { eventId },
    } = job

    try {
      if (await this.indexEventInfo(eventId)) {
        return job.moveToCompleted(eventId)
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async eventUpdated(job: Job<EventEventInfo>) {
    const {
      data: { eventId },
    } = job

    try {
      if (await this.indexEventInfo(eventId)) {
        return job.moveToCompleted()
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
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
