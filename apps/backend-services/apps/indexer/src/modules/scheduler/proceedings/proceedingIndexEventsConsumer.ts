import { IngressService } from '@app/rpc/microservices/ingress'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { EntityEventInfo } from '@app/scheduler-module'
import { EntityInfo, Proceeding } from 'defs'
import { ProceedingsIndexerService } from '../../indexer/services/proceedingsIndexerService'
import { AUTHOR, QUEUE_PROCEEDINGS } from '../../constants'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'

@Processor(QUEUE_PROCEEDINGS)
export class ProceedingIndexEventsConsumer extends WorkerHost {
  private readonly logger = new Logger(ProceedingIndexEventsConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly proceedingsIndexerService: ProceedingsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    await this.indexProceedingInfo(job.data.entityId)
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
