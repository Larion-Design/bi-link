import { IngressService } from '@app/rpc/microservices/ingress'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { eventSchema } from 'defs'
import { AUTHOR, QUEUE_GRAPH_EVENTS } from '../constants'
import { EntityEventInfo } from '@app/scheduler-module'
import { EventGraphService } from '../../graph/services/eventGraphService'

@Processor(QUEUE_GRAPH_EVENTS)
export class EventConsumer extends WorkerHost {
  private readonly logger = new Logger(EventConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly eventGraphService: EventGraphService,
  ) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    const {
      data: { entityId },
    } = job

    const eventModel = await this.getEventInfo(entityId)
    await this.eventGraphService.upsertEventNode(entityId, eventModel)
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
