import { EventsService } from '@app/models/services/eventsService'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
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

  @OnQueueActive()
  onQueueActive({ id, name }: Job) {
    this.logger.debug(`Processing job ID ${id} (${name})`)
  }

  @OnQueueCompleted()
  onQueueCompleted({ id, name }: Job) {
    this.logger.debug(`Completed job ID ${id} (${name})`)
  }

  @OnQueueFailed()
  onQueueFailed({ id, name, failedReason }: Job) {
    this.logger.error(`Failed job ID ${id} (${name}) - ${String(failedReason)}`)
  }

  @Process(EVENT_CREATED)
  async eventCreated(job: Job<EventEventInfo>) {
    const {
      data: { eventId },
    } = job

    try {
      await this.eventGraphService.upsertEventNode(eventId)
      return {}
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
      await this.eventGraphService.upsertEventNode(eventId)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }
}
