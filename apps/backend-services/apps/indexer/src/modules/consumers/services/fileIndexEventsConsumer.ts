import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_FILES } from '../../producers/constants'
import { FileEventInfo } from '@app/pub/types/file'
import { FilesIndexerService } from '@app/search-tools-module/indexer/filesIndexerService'

@Processor(QUEUE_FILES)
export class FileIndexEventsConsumer {
  private readonly logger = new Logger(FileIndexEventsConsumer.name)

  constructor(private readonly fileIndexerService: FilesIndexerService) {}

  @Process(EVENT_CREATED)
  async fileCreated(job: Job<FileEventInfo>) {
    const { data } = job

    try {
      const indexUpdated = await this.fileIndexerService.appendFileContent(data)
      return job.moveToCompleted(String(indexUpdated))
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async fileUpdated(job: Job<FileEventInfo>) {
    const { data } = job
    try {
      const indexUpdated = await this.fileIndexerService.appendFileContent(data)

      if (indexUpdated) {
        return job.moveToCompleted(job.data.fileId)
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
    return job.moveToFailed(new Error(`File ID ${data.fileId} could not be indexed`))
  }
}
