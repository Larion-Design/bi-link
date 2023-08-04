import { IngressService } from '@app/rpc/microservices/ingress'
import { WorkerHost, Processor } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { EntityEventInfo } from '@app/scheduler-module'
import { EntityInfo, Property } from 'defs'
import { AUTHOR, QUEUE_PROPERTIES } from '../../constants'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'
import { PropertiesIndexerService } from '../../indexer/services'

@Processor(QUEUE_PROPERTIES)
export class PropertyIndexEventsConsumer extends WorkerHost {
  private readonly logger = new Logger(PropertyIndexEventsConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly propertiesIndexerService: PropertiesIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    await this.indexPropertyInfo(job.data.entityId)
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
