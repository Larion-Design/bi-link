import { IngressService } from '@app/rpc/microservices/ingress'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED, EntityEventInfo } from '@app/scheduler-module'
import { EntityInfo, Proceeding } from 'defs'
import { ProceedingsIndexerService } from '../../indexer/services/proceedingsIndexerService'
import { AUTHOR, QUEUE_PROCEEDINGS } from '../../constants'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'

@Processor(QUEUE_PROCEEDINGS)
export class ProceedingIndexEventsConsumer {
  private readonly logger = new Logger(ProceedingIndexEventsConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
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
  async proceedingCreated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      if (await this.indexProceedingInfo(entityId)) {
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
      if (await this.indexProceedingInfo(entityId)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  private async indexProceedingInfo(entityId: string) {
    const entityInfo: EntityInfo = { entityId, entityType: 'PROCEEDING' }
    const property = (await this.ingressService.getEntity(entityInfo, true, AUTHOR)) as Proceeding

    if (property) {
      const indexingSuccessful = await this.proceedingsIndexerService.indexProceeding(
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
