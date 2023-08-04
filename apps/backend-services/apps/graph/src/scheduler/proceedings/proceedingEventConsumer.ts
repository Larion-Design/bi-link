import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { QUEUE_GRAPH_PROCEEDINGS } from '../constants'
import { EntityEventInfo } from '@app/scheduler-module'
import { ProceedingGraphService } from '../../graph/services/proceedingGraphService'

@Processor(QUEUE_GRAPH_PROCEEDINGS)
export class ProceedingEventConsumer extends WorkerHost {
  private readonly logger = new Logger(ProceedingEventConsumer.name)

  constructor(private readonly proceedingGraphService: ProceedingGraphService) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    const {
      data: { entityId },
    } = job
    await this.proceedingGraphService.upsertProceedingNode(entityId)
  }
}
