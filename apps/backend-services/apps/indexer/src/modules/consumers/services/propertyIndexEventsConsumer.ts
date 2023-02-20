import { Process, Processor } from '@nestjs/bull'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_PROPERTIES } from '@app/pub'
import { Logger } from '@nestjs/common'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { Job } from 'bull'
import { FileParentEntity } from '@app/pub/types/file'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { PropertiesIndexerService } from '@app/search-tools-module/indexer/propertiesIndexerService'
import { PropertyEventInfo } from '@app/pub/types/property'

@Processor(QUEUE_PROPERTIES)
export class PropertyIndexEventsConsumer {
  private readonly logger = new Logger(PropertyIndexEventsConsumer.name)

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertiesIndexerService: PropertiesIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {}

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
