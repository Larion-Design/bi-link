import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import { QUEUE_FILES } from '../../constants'
import { FilesIndexerService } from '../../indexer/services'
import { EVENT_CREATED, EVENT_UPDATED, FileEventInfo } from '@app/scheduler-module'

@Processor(QUEUE_FILES)
export class FileIndexEventsConsumer {
  private readonly logger = new Logger(FileIndexEventsConsumer.name)

  constructor(private readonly fileIndexerService: FilesIndexerService) {}

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
  async fileCreated(job: Job<FileEventInfo>) {
    const { data } = job

    try {
      if (await this.fileIndexerService.appendFileContent(data)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async fileUpdated(job: Job<FileEventInfo>) {
    const { data } = job
    try {
      if (await this.fileIndexerService.appendFileContent(data)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }
}
