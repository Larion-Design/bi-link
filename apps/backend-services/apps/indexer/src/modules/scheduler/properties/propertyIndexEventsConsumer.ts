import { IngressService } from '@app/rpc/microservices/ingress'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED, EntityEventInfo } from '@app/scheduler-module'
import { EntityInfo, Property } from 'defs'
import { AUTHOR, QUEUE_PROPERTIES } from '../../constants'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'
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
  async propertyCreated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      if (await this.indexPropertyInfo(entityId)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async propertyUpdated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      if (await this.indexPropertyInfo(entityId)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  private indexPropertyInfo = async (entityId: string) => {
    const entityInfo: EntityInfo = { entityId, entityType: 'PROPERTY' }
    const property = (await this.ingressService.getEntity(entityInfo, true, AUTHOR)) as Property

    if (property) {
      const indexingSuccessful = await this.propertiesIndexerService.indexProperty(
        entityId,
        property,
      )

      if (indexingSuccessful) {
        const filesIds = property.files.map(({ fileId }) => fileId)

        if (filesIds.length) {
          await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, entityInfo)
        }
        return true
      }
    }
  }
}
