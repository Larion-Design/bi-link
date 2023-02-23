import { Logger } from '@nestjs/common'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Processor } from '@nestjs/bull'
import { QUEUE_EVENTS } from '@app/pub'
import { Job } from 'bull'

@Processor(QUEUE_EVENTS)
export class EventsQueueWatcherService {
  private readonly logger = new Logger(EventsQueueWatcherService.name)

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
