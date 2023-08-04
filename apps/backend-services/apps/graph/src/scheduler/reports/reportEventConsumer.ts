import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { EntityEventInfo } from '@app/scheduler-module'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { QUEUE_GRAPH_REPORTS } from '../constants'
import { ReportGraphService } from '../../graph/services/reportGraphService'

@Processor(QUEUE_GRAPH_REPORTS)
export class ReportEventConsumer extends WorkerHost {
  private readonly logger = new Logger(ReportEventConsumer.name)

  constructor(private readonly reportGraphService: ReportGraphService) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    const {
      data: { entityId },
    } = job

    await this.reportGraphService.upsertReportNode(entityId)
  }
}
