import { Logger } from '@nestjs/common'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { QUEUE_FILES } from '../../producers/constants'

@Processor(QUEUE_FILES)
export class FilesQueueWatcherService {
  private readonly logger = new Logger(FilesQueueWatcherService.name)

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
