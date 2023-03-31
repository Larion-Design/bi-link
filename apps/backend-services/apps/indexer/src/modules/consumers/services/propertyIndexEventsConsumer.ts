import { IngressService } from '@app/rpc/microservices/ingress'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import {
  EVENT_CREATED,
  EVENT_UPDATED,
  FileParentEntity,
  PropertyEventInfo,
} from '@app/scheduler-module'
import { Property } from 'defs'
import { QUEUE_PROPERTIES } from '../../constants'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { PropertiesIndexerService } from '../../indexer/services'

@Processor(QUEUE_PROPERTIES)
export class PropertyIndexEventsConsumer {
  private readonly logger = new Logger(PropertyIndexEventsConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
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
    const property = (await this.ingressService.getEntity(
      { entityId: propertyId, entityType: 'PROPERTY' },
      true,
      {
        type: 'SERVICE',
        sourceId: 'SERVICE_INDEXER',
      },
    )) as Property

    if (property) {
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
}
