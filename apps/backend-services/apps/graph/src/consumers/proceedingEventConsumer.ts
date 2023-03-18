import { ProceedingsService } from '@app/models/services/proceedingsService'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { QUEUE_GRAPH_PROCEEDINGS } from '../producers/constants'
import { EVENT_CREATED, EVENT_UPDATED, ProceedingEventInfo } from '@app/scheduler-module'
import { ProceedingGraphService } from './services/proceedingGraphService'

@Processor(QUEUE_GRAPH_PROCEEDINGS)
export class ProceedingEventConsumer {
  private readonly logger = new Logger(ProceedingEventConsumer.name)

  constructor(
    private readonly proceedingsService: ProceedingsService,
    private readonly proceedingGraphService: ProceedingGraphService,
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
  onQueueFailed({ id, name }: Job) {
    this.logger.debug(`Failed job ID ${id} (${name})`)
  }

  @Process(EVENT_CREATED)
  async propertyCreated(job: Job<ProceedingEventInfo>) {
    const {
      data: { proceedingId },
    } = job

    try {
      await this.proceedingGraphService.upsertProceedingNode(proceedingId)
      return job.moveToCompleted()
    } catch (error) {
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async propertyUpdated(job: Job<ProceedingEventInfo>) {
    const {
      data: { proceedingId },
    } = job

    try {
      await this.proceedingGraphService.upsertProceedingNode(proceedingId)
      return job.moveToCompleted()
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }
}
