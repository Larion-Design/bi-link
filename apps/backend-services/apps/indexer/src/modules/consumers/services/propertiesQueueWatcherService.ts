import { Logger } from '@nestjs/common'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { QUEUE_PROPERTIES } from '../../producers/constants'

@Processor(QUEUE_PROPERTIES)
export class PropertiesQueueWatcherService {
  private readonly logger = new Logger(PropertiesQueueWatcherService.name)

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
