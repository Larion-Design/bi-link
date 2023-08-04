import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { QUEUE_GRAPH_PROPERTIES } from '../constants'
import { EntityEventInfo } from '@app/scheduler-module'
import { PropertyGraphService } from '../../graph/services/propertyGraphService'

@Processor(QUEUE_GRAPH_PROPERTIES)
export class PropertyEventConsumer extends WorkerHost {
  private readonly logger = new Logger(PropertyEventConsumer.name)

  constructor(private readonly propertyGraphService: PropertyGraphService) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    const {
      data: { entityId },
    } = job

    await this.propertyGraphService.upsertPropertyNode(entityId)
  }
}
