import { IngressService } from '@app/rpc/microservices/ingress'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { eventSchema } from 'defs'
import { QUEUE_GRAPH_EVENTS } from '../producers/constants'
import { EVENT_CREATED, EVENT_UPDATED, EventEventInfo } from '@app/scheduler-module'
import { EventGraphService } from '../graph/services/eventGraphService'

@Processor(QUEUE_GRAPH_EVENTS)
export class EventConsumer {
  private readonly logger = new Logger(EventConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
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
      const eventModel = await this.getEventInfo(eventId)
      await this.eventGraphService.upsertEventNode(eventId, eventModel)
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
      const eventModel = await this.getEventInfo(eventId)
      await this.eventGraphService.upsertEventNode(eventId, eventModel)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  private getEventInfo = async (eventId) =>
    eventSchema.parse(
      await this.ingressService.getEntity({ entityId: eventId, entityType: 'EVENT' }, true, {
        type: 'SERVICE',
        sourceId: 'SERVICE_INDEXER',
      }),
    )
}
