import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { QUEUE_GRAPH_PROCEEDINGS } from '../constants'
import { EVENT_CREATED, EVENT_UPDATED, EntityEventInfo } from '@app/scheduler-module'
import { ProceedingGraphService } from '../../graph/services/proceedingGraphService'

@Processor(QUEUE_GRAPH_PROCEEDINGS)
export class ProceedingEventConsumer {
  private readonly logger = new Logger(ProceedingEventConsumer.name)

  constructor(private readonly proceedingGraphService: ProceedingGraphService) {}

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
  async propertyCreated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      await this.proceedingGraphService.upsertProceedingNode(entityId)
      return {}
    } catch (error) {
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async propertyUpdated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      await this.proceedingGraphService.upsertProceedingNode(entityId)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }
}
