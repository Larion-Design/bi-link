import { EVENT_CREATED, EVENT_UPDATED, FileEventInfo } from '@app/scheduler-module'
import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { EntityInfo } from 'defs'
import { QUEUE_FILES } from '../../constants'

@Injectable()
export class FileEventDispatcherService {
  protected readonly logger = new Logger(FileEventDispatcherService.name)

  constructor(@InjectQueue(QUEUE_FILES) private readonly queue: Queue<FileEventInfo>) {}

  async dispatchFileCreated(fileId: string) {
    return this.publishJob(EVENT_CREATED, { fileId })
  }

  async dispatchFileUpdated(fileId: string) {
    return this.publishJob(EVENT_UPDATED, { fileId })
  }

  async dispatchFilesUpdated(filesIds: string[], linkedEntity?: EntityInfo) {
    return this.queue.addBulk(
      filesIds.map((fileId) => ({ name: EVENT_UPDATED, data: { fileId, linkedEntity } })),
    )
  }

  protected async publishJob(eventType: string, eventInfo: FileEventInfo) {
    try {
      return this.queue.add(eventType, eventInfo)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
