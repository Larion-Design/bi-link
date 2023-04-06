import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED, ReportEventInfo } from '@app/scheduler-module'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { QUEUE_GRAPH_REPORTS } from '../producers/constants'
import { ReportGraphService } from '../graph/services/reportGraphService'

@Processor(QUEUE_GRAPH_REPORTS)
export class ReportEventConsumer {
  private readonly logger = new Logger(ReportEventConsumer.name)

  constructor(private readonly reportGraphService: ReportGraphService) {}

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
  async reportCreated(job: Job<ReportEventInfo>) {
    const {
      data: { reportId },
    } = job

    try {
      await this.reportGraphService.upsertReportNode(reportId)
      return {}
    } catch (error) {
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async reportUpdated(job: Job<ReportEventInfo>) {
    const {
      data: { reportId },
    } = job

    try {
      await this.reportGraphService.upsertReportNode(reportId)
      return {}
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }
}
