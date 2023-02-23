import { Logger } from '@nestjs/common'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { QUEUE_COMPANIES } from '../../producers/constants'

@Processor(QUEUE_COMPANIES)
export class CompaniesQueueWatcherService {
  private readonly logger = new Logger(CompaniesQueueWatcherService.name)

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
}
