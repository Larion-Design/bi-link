import { IngressService } from '@app/rpc/microservices/ingress'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { eventSchema } from 'defs'
import { AUTHOR, QUEUE_GRAPH_EVENTS } from '../constants'
import { EVENT_CREATED, EVENT_UPDATED, EntityEventInfo } from '@app/scheduler-module'
import { EventGraphService } from '../../graph/services/eventGraphService'

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
  async eventCreated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      const eventModel = await this.getEventInfo(entityId)
      await this.eventGraphService.upsertEventNode(entityId, eventModel)
      return {}
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
      const eventModel = await this.getEventInfo(entityId)
      await this.eventGraphService.upsertEventNode(entityId, eventModel)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  private getEventInfo = async (entityId) =>
    eventSchema.parse(
      await this.ingressService.getEntity(
        { entityId: entityId, entityType: 'EVENT' },
        true,
        AUTHOR,
      ),
    )
}
