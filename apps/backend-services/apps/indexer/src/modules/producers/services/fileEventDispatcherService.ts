import {
  EVENT_CREATED,
  EVENT_UPDATED,
  FileEventInfo,
  FileLinkedEntity,
} from '@app/scheduler-module'
import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { QUEUE_FILES } from '../../constants'

@Injectable()
export class FileEventDispatcherService {
  private readonly logger = new Logger(FileEventDispatcherService.name)

  constructor(@InjectQueue(QUEUE_FILES) private readonly queue: Queue<FileEventInfo>) {
    void this.queue.empty()
  }

  dispatchFileCreated = async (fileId: string) => this.publishJob(EVENT_CREATED, { fileId })

  dispatchFileUpdated = async (fileId: string) => this.publishJob(EVENT_UPDATED, { fileId })

  dispatchFilesUpdated = async (filesIds: string[], linkedEntity?: FileLinkedEntity) =>
    this.queue.addBulk(
      filesIds.map((fileId) => ({
        name: EVENT_UPDATED,
        data: {
          fileId,
          linkedEntity,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: FileEventInfo) => {
    try {
      const { id } = await this.queue.add(eventType, eventInfo)

      this.logger.debug(`Created job ${id} for file ID ${eventInfo.fileId}`)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
