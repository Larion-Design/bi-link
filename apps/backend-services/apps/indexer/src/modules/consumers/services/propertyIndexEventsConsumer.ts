import {
  EVENT_CREATED,
  EVENT_UPDATED,
  FileParentEntity,
  PropertyEventInfo,
} from '@app/scheduler-module'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { QUEUE_PROPERTIES } from '../../producers/constants'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { Job } from 'bull'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { PropertiesIndexerService } from '@app/search-tools-module/indexer/propertiesIndexerService'

@Processor(QUEUE_PROPERTIES)
export class PropertyIndexEventsConsumer {
  private readonly logger = new Logger(PropertyIndexEventsConsumer.name)

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertiesIndexerService: PropertiesIndexerService,
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
  async propertyCreated(job: Job<PropertyEventInfo>) {
    const {
      data: { propertyId },
    } = job

    try {
      if (await this.indexPropertyInfo(propertyId)) {
        return job.moveToCompleted(propertyId)
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async propertyUpdated(job: Job<PropertyEventInfo>) {
    const {
      data: { propertyId },
    } = job

    try {
      if (await this.indexPropertyInfo(propertyId)) {
        return job.moveToCompleted()
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  private indexPropertyInfo = async (propertyId: string) => {
    const property = await this.propertiesService.getProperty(propertyId, true)
    const indexingSuccessful = await this.propertiesIndexerService.indexProperty(
      propertyId,
      property,
    )

    if (indexingSuccessful) {
      const filesIds = property.files.map(({ fileId }) => fileId)

      if (filesIds.length) {
        await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, {
          type: FileParentEntity.PROPERTY,
          id: propertyId,
        })
      }
      return true
    }
  }
}
