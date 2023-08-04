import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common'
import { QUEUE_FILES } from '../../constants'
import { FilesIndexerService } from '../../indexer/services'
import { FileEventInfo } from '@app/scheduler-module'

@Processor(QUEUE_FILES)
export class FileIndexEventsConsumer extends WorkerHost {
  private readonly logger = new Logger(FileIndexEventsConsumer.name)

  constructor(private readonly fileIndexerService: FilesIndexerService) {
    super()
  }

  async process(job: Job<FileEventInfo>): Promise<void> {
    await this.fileIndexerService.appendFileContent(job.data)
  }
}
