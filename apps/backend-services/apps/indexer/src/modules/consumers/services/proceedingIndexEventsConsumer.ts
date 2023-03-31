import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { ProceedingsService } from '@app/models/proceeding/services/proceedingsService'
import {
  EVENT_CREATED,
  EVENT_UPDATED,
  FileParentEntity,
  ProceedingEventInfo,
} from '@app/scheduler-module'
import { ProceedingsIndexerService } from '../../indexer/services/proceedingsIndexerService'
import { QUEUE_PROCEEDINGS } from '../../constants'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'

@Processor(QUEUE_PROCEEDINGS)
export class ProceedingIndexEventsConsumer {
  private readonly logger = new Logger(ProceedingIndexEventsConsumer.name)

  constructor(
    private readonly proceedingsService: ProceedingsService,
    private readonly proceedingsIndexerService: ProceedingsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {}

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
  async proceedingCreated(job: Job<ProceedingEventInfo>) {
    const {
      data: { proceedingId },
    } = job

    try {
      if (await this.indexProceedingInfo(proceedingId)) {
        return job.moveToCompleted(proceedingId)
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async propertyUpdated(job: Job<ProceedingEventInfo>) {
    const {
      data: { proceedingId },
    } = job

    try {
      if (await this.indexProceedingInfo(proceedingId)) {
        return job.moveToCompleted()
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  private indexProceedingInfo = async (proceedingId: string) => {
    const property = await this.proceedingsService.getProceeding(proceedingId, true)
    const indexingSuccessful = await this.proceedingsIndexerService.indexProceeding(
      proceedingId,
      property,
    )

    if (indexingSuccessful) {
      const filesIds = property.files.map(({ fileId }) => fileId)

      if (filesIds.length) {
        await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, {
          type: FileParentEntity.PROCEEDING,
          id: proceedingId,
        })
      }
      return true
    }
  }
}
