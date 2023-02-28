import { EventsService } from '@app/entities/services/eventsService'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'
import { QUEUE_GRAPH_EVENTS } from '../producers/constants'
import { EVENT_CREATED, EVENT_UPDATED, EventEventInfo } from '@app/scheduler-module'
import { EventGraphService } from './services/eventGraphService'

@Processor(QUEUE_GRAPH_EVENTS)
export class EventConsumer {
  private readonly logger = new Logger(EventConsumer.name)

  constructor(
    private readonly eventsService: EventsService,
    private readonly eventGraphService: EventGraphService,
  ) {}

  @Process(EVENT_CREATED)
  async eventCreated(job: Job<EventEventInfo>) {
    const {
      data: { eventId },
    } = job

    try {
      await this.eventGraphService.upsertEventNode(eventId)
      return job.moveToCompleted()
    } catch (error) {
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async eventUpdated(job: Job<EventEventInfo>) {
    const {
      data: { eventId },
    } = job

    try {
      await this.eventGraphService.upsertEventNode(eventId)
      return job.moveToCompleted()
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }
}
